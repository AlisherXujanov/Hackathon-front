# UnitSchool - Полная Реконструкция | Часть 2
## План Внедрения (Продолжение)

## Схема Базы Данных (Продолжение)

**3. Система Баллов (`backend/points/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class Points(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='points'
    )
    total_points = models.IntegerField(default=0)
    daily_points = models.IntegerField(default=0)
    last_daily_reset = models.DateField(auto_now_add=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'points'
        verbose_name_plural = 'Points'
    
    def __str__(self):
        return f"{self.user.username}: {self.total_points} points"

class PointsHistory(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'Вход в систему'),
        ('lesson', 'Завершение урока'),
        ('task', 'Завершение задачи'),
        ('streak', 'Бонус за серию'),
        ('achievement', 'Достижение'),
    ]
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='points_history'
    )
    points = models.IntegerField()  # Может быть отрицательным
    reason = models.CharField(max_length=200)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    metadata = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'points_history'
        verbose_name_plural = 'Points History'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.points} ({self.activity_type})"
```

**4. Таблица Лидеров (`backend/leaderboard/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class LeaderboardEntry(models.Model):
    PERIOD_CHOICES = [
        ('daily', 'Ежедневно'),
        ('weekly', 'Еженедельно'),
        ('monthly', 'Ежемесячно'),
    ]
    
    SUBJECT_CHOICES = [
        ('all', 'Все предметы'),
        ('english', 'Английский'),
        ('programming', 'Программирование'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    period_type = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    period_date = models.DateField()  # Дата начала периода
    points = models.IntegerField()
    rank = models.IntegerField()
    subject = models.CharField(
        max_length=20,
        choices=SUBJECT_CHOICES,
        default='all'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard_entries'
        unique_together = ['user', 'period_type', 'period_date', 'subject']
        indexes = [
            models.Index(fields=['period_type', 'period_date', 'subject', 'rank']),
            models.Index(fields=['user', 'period_type']),
        ]
        ordering = ['rank']
    
    def __str__(self):
        return f"#{self.rank} {self.user.username} - {self.points} points ({self.period_type})"
```

**5. Отслеживание Активности (`backend/analytics/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class ActivityLog(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'Вход'),
        ('lesson', 'Урок'),
        ('task', 'Задача'),
        ('practice', 'Практика'),
        ('test', 'Тест'),
    ]
    
    SUBJECT_CHOICES = [
        ('english', 'Английский'),
        ('programming', 'Программирование'),
    ]
    
    SKILL_CHOICES = [
        # Английский
        ('grammar', 'Грамматика'),
        ('reading', 'Чтение'),
        ('writing', 'Письмо'),
        ('listening', 'Аудирование'),
        ('vocabulary', 'Словарный запас'),
        # Программирование
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('html_css', 'HTML/CSS'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    skill = models.CharField(max_length=20, choices=SKILL_CHOICES, null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    
    # Дополнительные данные
    metadata = models.JSONField(null=True, blank=True)
    # {"lesson_id": 1, "score": 85, "completed": true, ...}
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_logs'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', 'subject']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

class DailyAnalytics(models.Model):
    """Агрегированная аналитика по дням"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    
    # Общая активность
    total_duration = models.IntegerField(default=0)  # минуты
    activity_count = models.IntegerField(default=0)
    
    # По предметам
    english_duration = models.IntegerField(default=0)
    programming_duration = models.IntegerField(default=0)
    
    # Завершённые
    lessons_completed = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'daily_analytics'
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', '-date']),
        ]
        ordering = ['-date']
```

**6. AI Беседы (`backend/ai/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class AIConversation(models.Model):
    CONVERSATION_TYPES = [
        ('writing', 'Помощь с письмом'),
        ('grammar', 'Грамматика'),
        ('coding', 'Программирование'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    conversation_type = models.CharField(max_length=20, choices=CONVERSATION_TYPES)
    
    # Контекст разговора
    context = models.JSONField(null=True, blank=True)
    # {"task_id": 1, "code": "...", "language": "python", ...}
    
    # История сообщений
    messages = models.JSONField(default=list)
    # [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}, ...]
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_conversations'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['conversation_type']),
        ]
        ordering = ['-created_at']

class AIUsage(models.Model):
    """Отслеживание использования AI"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    count = models.IntegerField(default=0)
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    
    class Meta:
        db_table = 'ai_usage'
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]
```

### 1.3 Настройка Аутентификации

**Backend - JWT Endpoints уже существуют в `backend/users/views.py`:**

Проверка существующих эндпоинтов:
- `/api/v1/auth/register/` - Регистрация
- `/api/v1/auth/login/` - Вход
- `/api/v1/auth/refresh/` - Обновление токена
- `/api/v1/auth/logout/` - Выход (blacklist)

**Добавление сброса пароля (`backend/users/views.py`):**

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Запрос на сброс пароля"""
    email = request.data.get('email')
    
    try:
        user = CustomUser.objects.get(email=email)
        token = default_token_generator.make_token(user)
        
        # Отправка email (асинхронно через Celery)
        from .tasks import send_password_reset_email
        send_password_reset_email.delay(user.id, token)
        
        return Response({
            'message': 'Password reset email sent'
        })
    except CustomUser.DoesNotExist:
        # Не раскрываем, существует ли пользователь
        return Response({
            'message': 'If email exists, reset link will be sent'
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """Подтверждение сброса пароля"""
    token = request.data.get('token')
    new_password = request.data.get('password')
    user_id = request.data.get('user_id')
    
    try:
        user = CustomUser.objects.get(id=user_id)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'})
        else:
            return Response(
                {'error': 'Invalid or expired token'},
                status=400
            )
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid user'}, status=400)
```

**Frontend - Обновление `src/services/djangoAuth.js`:**

```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance с автоматическим обновлением токена
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor для добавления JWT токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обновления токена при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token также истёк
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    try {
      await apiClient.post('/auth/logout/', {
        refresh: refreshToken,
      });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export default apiClient;
```

---

## Наблюдаемость и Production Готовность

### Структурированное Логирование

**Backend (`backend/backend/settings.py`):**

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/django.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 5,
            'formatter': 'json',
        },
        'error_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/error.log',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
            'formatter': 'json',
            'level': 'ERROR',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'error_file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'ai': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'celery': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### Отслеживание Ошибок - Sentry

**Установка:**
```bash
pip install sentry-sdk
```

**Backend (`backend/backend/settings.py`):**

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[
        DjangoIntegration(),
        CeleryIntegration(),
    ],
    traces_sample_rate=0.1,  # 10% транзакций для отслеживания производительности
    send_default_pii=False,  # Не отправлять персональные данные
    environment=os.getenv('ENVIRONMENT', 'development'),
)
```

**Кастомный контекст:**

```python
from sentry_sdk import configure_scope

def add_user_context(user):
    with configure_scope() as scope:
        scope.user = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
```

### Мониторинг Производительности

**Backend (`backend/core/middleware.py`):**

```python
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class PerformanceMiddleware(MiddlewareMixin):
    """Отслеживание времени ответа API"""
    
    def process_request(self, request):
        request.start_time = time.time()
    
    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # Логирование медленных запросов (> 1 секунды)
            if duration > 1.0:
                logger.warning(
                    f"Slow request: {request.method} {request.path} "
                    f"took {duration:.2f}s"
                )
            
            # Добавление заголовка с временем выполнения
            response['X-Response-Time'] = f"{duration:.3f}s"
        
        return response
```

**Метрики AI запросов:**

```python
# backend/ai/middleware.py
class AIMetricsMiddleware:
    """Метрики использования AI"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.path.startswith('/api/v1/ai/'):
            start_time = time.time()
            response = self.get_response(request)
            duration = time.time() - start_time
            
            # Логирование стоимости AI запроса
            logger.info(
                f"AI request to {request.path} "
                f"took {duration:.2f}s",
                extra={
                    'user_id': request.user.id if request.user.is_authenticated else None,
                    'endpoint': request.path,
                    'duration': duration,
                }
            )
            
            return response
        
        return self.get_response(request)
```

### Caching для Производительности

**Backend (`backend/backend/settings.py`):**

```python
# Cache настройки уже добавлены выше (Redis)

# Кеширование представлений
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

@method_decorator(cache_page(60 * 15), name='dispatch')  # 15 минут
class PublicLeaderboardView(APIView):
    """Публичная таблица лидеров"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        # ...
        pass
```

**Кеширование запросов к БД:**

```python
from django.core.cache import cache

def get_user_analytics(user_id):
    cache_key = f'analytics:user:{user_id}'
    data = cache.get(cache_key)
    
    if data is None:
        # Вычисление аналитики
        data = calculate_analytics(user_id)
        cache.set(cache_key, data, timeout=3600)  # 1 час
    
    return data
```

---

## Стратегия Окружений

### Конфигурация Окружений

**Development:**
```env
DEBUG=True
ENVIRONMENT=development
DATABASE_URL=postgresql://localhost/unitschool_dev
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Staging:**
```env
DEBUG=False
ENVIRONMENT=staging
DATABASE_URL=postgresql://staging-db/unitschool_staging
ALLOWED_HOSTS=staging.unitschool.com
CORS_ALLOWED_ORIGINS=https://staging-app.unitschool.com
SENTRY_DSN=your-sentry-dsn
```

**Production:**
```env
DEBUG=False
ENVIRONMENT=production
DATABASE_URL=postgresql://prod-db/unitschool
ALLOWED_HOSTS=api.unitschool.com
CORS_ALLOWED_ORIGINS=https://unitschool.com,https://www.unitschool.com
SENTRY_DSN=your-sentry-dsn
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

### Feature Flags

**Backend (`backend/core/features.py`):**

```python
from django.conf import settings

class FeatureFlags:
    """Управление флагами функций"""
    
    FLAGS = {
        'ai_writing_enabled': True,
        'ai_coding_enabled': True,
        'leaderboard_enabled': True,
        'class_system_enabled': True,
        'new_recommendation_algorithm': False,  # Эксперимент
    }
    
    @classmethod
    def is_enabled(cls, flag_name):
        # Проверка переменной окружения
        env_flag = settings.env(f'FEATURE_{flag_name.upper()}', default=None)
        if env_flag is not None:
            return env_flag == 'true'
        
        # Fallback на стандартное значение
        return cls.FLAGS.get(flag_name, False)

# Использование
from core.features import FeatureFlags

if FeatureFlags.is_enabled('ai_writing_enabled'):
    # AI функционал
    pass
```

---

## Конфиденциальность Данных и Соответствие

### Политика Хранения Данных

**Backend (`backend/core/data_retention.py`):**

```python
from celery import shared_task
from django.utils import timezone
from datetime import timedelta

@shared_task
def cleanup_old_data():
    """Очистка старых данных согласно политике"""
    cutoff_date = timezone.now() - timedelta(days=90)
    
    # Удаление старых логов активности
    from analytics.models import ActivityLog
    ActivityLog.objects.filter(created_at__lt=cutoff_date).delete()
    
    # Удаление старых AI разговоров
    from ai.models import AIConversation
    AIConversation.objects.filter(created_at__lt=cutoff_date).delete()
    
    # Анонимизация удалённых пользователей
    from users.models import CustomUser
    deleted_cutoff = timezone.now() - timedelta(days=30)
    CustomUser.objects.filter(
        is_active=False,
        updated_at__lt=deleted_cutoff
    ).update(
        email=models.F('id') + '@deleted.local',
        first_name='[Deleted]',
        last_name='User'
    )
```

### Экспорт Данных Пользователя

**Backend (`backend/users/views.py`):**

```python
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_user_data(request):
    """Экспорт всех данных пользователя (GDPR-совместимо)"""
    user = request.user
    
    data = {
        'user': {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'created_at': user.created_at.isoformat(),
        },
        'profile': {
            'bio': user.profile.bio,
            'streak_days': user.profile.streak_days,
            'total_learning_hours': str(user.profile.total_learning_hours),
        },
        'progress': list(user.progress.values()),
        'points': {
            'total': user.points.total_points,
            'history': list(
                user.points_history.values('points', 'reason', 'created_at')
            ),
        },
        'activity_logs': list(
            user.activitylog_set.values(
                'activity_type', 'subject', 'skill', 'duration_minutes', 'created_at'
            )
        ),
        'submissions': list(
            user.tasksubmission_set.values(
                'task__title', 'status', 'score', 'submitted_at'
            )
        ),
    }
    
    response = HttpResponse(
        json.dumps(data, indent=2, ensure_ascii=False),
        content_type='application/json'
    )
    response['Content-Disposition'] = f'attachment; filename="user_data_{user.id}.json"'
    
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_user_account(request):
    """Удаление аккаунта пользователя"""
    user = request.user
    
    # Мягкое удаление (деактивация)
    user.is_active = False
    user.save()
    
    # Планирование полного удаления через 30 дней
    from .tasks import schedule_user_deletion
    schedule_user_deletion.apply_async(
        args=[user.id],
        countdown=30 * 24 * 60 * 60  # 30 дней
    )
    
    return Response({
        'message': 'Account will be deleted in 30 days. You can cancel this by logging in.'
    })
```

---

## Оценки и Временные Рамки

### Определение MVP

**MVP включает (минимальный жизнеспособный продукт):**

1. ✅ Аутентификация (регистрация, вход, JWT)
2. ✅ Профили пользователей (базовые)
3. ✅ Английский язык - грамматика (базовые упражнения)
4. ✅ Система баллов (базовая)
5. ✅ Таблица лидеров (ежедневная)
6. ✅ Программирование - базовые задачи (Python)

**Для полного запуска:**

7. Все модули английского
8. AI интеграция
9. Система классов
10. Аналитика и рекомендации
11. Полная документация

### Примерная Продолжительность Фаз

| Фаза    | Описание               | Продолжительность | Разработчики      |
| ------- | ---------------------- | ----------------- | ----------------- |
| Фаза 1  | Основа и настройка     | 1 неделя          | Все (4)           |
| Фаза 2  | Пользователи и профили | 1 неделя          | Dev 1 + Dev 4     |
| Фаза 3  | Английский язык        | 3 недели          | Dev 2 + поддержка |
| Фаза 4  | IT/Программирование    | 2 недели          | Dev 3 + поддержка |
| Фаза 5  | AI интеграция          | 2 недели          | Dev 3 + Dev 2     |
| Фаза 6  | Система классов        | 1.5 недели        | Dev 4 + Dev 1     |
| Фаза 7  | Баллы и лидерборд      | 1 неделя          | Dev 4 + Dev 1     |
| Фаза 8  | Аналитика              | 2 недели          | Dev 4 + поддержка |
| Фаза 9  | Интеграция и полировка | 2 недели          | Все (4)           |
| Фаза 10 | Развёртывание          | 1 неделя          | Все (4)           |

**Итого: ~16.5 недель (4 месяца)**

**MVP (Фазы 1-2 + базовые части 3, 4, 7): ~6 недель**

### Критический Путь

1. **Недели 1-2:** Фундамент (основа, аутентификация, БД)
2. **Недели 3-5:** Основной контент (английский + программирование базовые)
3. **Недели 6-8:** Расширенные функции (AI, классы)
4. **Недели 9-12:** Аналитика и рекомендации
5. **Недели 13-15:** Интеграция, тестирование, оптимизация
6. **Неделя 16:** Развёртывание и запуск

---

## Развёртывание

### Backend Развёртывание (Django)

**Сервер: AWS EC2 / DigitalOcean Droplet**

**Установка зависимостей:**
```bash
# Системные пакеты
sudo apt update
sudo apt install python3.11 python3.11-venv postgresql nginx redis-server

# PostgreSQL настройка
sudo -u postgres createdb unitschool
sudo -u postgres createuser unitschool_user
sudo -u postgres psql -c "ALTER USER unitschool_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE unitschool TO unitschool_user;"

# Проект
cd /var/www/unitschool-backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Миграции
python manage.py migrate
python manage.py collectstatic --noinput
```

**Gunicorn (`gunicorn.service`):**
```ini
[Unit]
Description=Gunicorn daemon for UnitSchool
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/unitschool-backend
EnvironmentFile=/var/www/unitschool-backend/.env
ExecStart=/var/www/unitschool-backend/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/var/www/unitschool-backend/gunicorn.sock \
    backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Nginx (`/etc/nginx/sites-available/unitschool`):**
```nginx
upstream django {
    server unix:/var/www/unitschool-backend/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name api.unitschool.com;

    client_max_body_size 10M;

    location /static/ {
        alias /var/www/unitschool-backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/unitschool-backend/media/;
    }

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://django;
    }
}
```

**SSL (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.unitschool.com
```

### Frontend Развёртывание (Next.js на Vercel)

**1. Подготовка проекта:**

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.unitschool.com/api/v1
NEXT_PUBLIC_TOGETHER_AI_KEY=production_key
```

**2. Развёртывание на Vercel:**

```bash
# Установка Vercel CLI
npm i -g vercel

# Развёртывание
cd Unit-school-frontend
vercel --prod
```

**3. Конфигурация Vercel (`vercel.json`):**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_TOGETHER_AI_KEY": "@together-ai-key"
  }
}
```

### База Данных

**Production PostgreSQL:**

```bash
# Настройка репликации (опционально)
# Регулярные резервные копии
0 2 * * * pg_dump unitschool > /backups/unitschool_$(date +\%Y\%m\%d).sql

# Мониторинг подключений
SELECT count(*) FROM pg_stat_activity;
```

**Пулы подключений (`settings.py`):**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'unitschool',
        'USER': 'unitschool_user',
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Переиспользование подключений
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### CI/CD Pipeline

**GitHub Actions (`.github/workflows/deploy.yml`):**

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd Unit-school-backend/backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd Unit-school-backend/backend
          pytest

  deploy-backend:
    needs: test-backend
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/unitschool-backend
            git pull origin main
            source venv/bin/activate
            pip install -r requirements.txt
            python manage.py migrate
            python manage.py collectstatic --noinput
            sudo systemctl restart gunicorn
            sudo systemctl restart celery

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Резюме Технологического Стека

### Frontend
- **Фреймворк:** Next.js 15 (App Router)
- **UI библиотека:** React 19
- **Стилизация:** Tailwind CSS + SCSS
- **Иконки:** React Icons
- **Графики:** ECharts (echarts-for-react)
- **Редактор кода:** Monaco Editor
- **HTTP клиент:** Axios (с interceptors)
- **Уведомления:** nextjs-toast-notify
- **Анимации:** Framer Motion

### Backend
- **Фреймворк:** Django 5.2
- **API:** Django REST Framework
- **Аутентификация:** JWT (djangorestframework-simplejwt)
- **База данных:** PostgreSQL (production) / SQLite (development)
- **Фоновые задачи:** Celery + Redis
- **Кеширование:** Redis
- **Документация API:** drf-spectacular (OpenAPI/Swagger)
- **Мониторинг:** Sentry
- **Python:** 3.11+

### AI Сервисы
- **Провайдер:** Together AI
- **Модели:**
  - Английский Writing: Gemma 3n (валидация), Llama 8B (оценка), Llama 70B (синтез)
  - Английский Grammar: Llama 8B
  - Coding: Llama 8B или 70B

### Инфраструктура
- **Backend хостинг:** AWS EC2 / DigitalOcean
- **Frontend хостинг:** Vercel
- **База данных:** PostgreSQL (управляемая)
- **Кеш/Очередь:** Redis
- **Хранилище файлов:** AWS S3 / DigitalOcean Spaces
- **CDN:** Cloudflare
- **Мониторинг:** Sentry + Prometheus + Grafana (опционально)

---

## Распределение Команды (Обновлено)

### Разработчик 1: Backend Foundation (Фазы 1-2)
- Настройка Django и конфигурация
- Проектирование и реализация моделей БД
- Система аутентификации (JWT)
- API профилей пользователей
- Backend аналитики профилей
- **Безопасность и разрешения**
- **API версионирование и контракты**

### Разработчик 2: Английский язык (Фаза 3)
- Все модули английского языка
- Грамматика, Чтение, Письмо, Аудирование, Словарный запас
- Система тестирования и оценки
- API для английского языка
- **Интеграция AI для английского**

### Разработчик 3: IT предмет и AI (Фазы 4-5)
- Система задач по программированию
- Реализация песочницы для кода
- Интеграция AI (все 3 модели)
- AI агент для программирования
- Среда выполнения кода
- **Метрики и ограничения использования AI**

### Разработчик 4: Функции и Аналитика (Фазы 6-8)
- Система управления классами
- Система баллов и таблица лидеров
- Разработка алгоритма аналитики
- Движок рекомендаций
- Функции мониторинга студентов
- **Celery задачи и фоновая обработка**
- **Наблюдаемость и мониторинг**

### Все Команда: Интеграция и Полировка (Фазы 9-10)
- Миграция данных
- Тестирование (unit, integration, E2E)
- Оптимизация производительности
- Полировка UI/UX
- Развёртывание
- Документация

---

## Критерии Успеха

- ✅ Все существующие функции мигрированы с Firebase на Django
- ✅ Все новые функции реализованы и протестированы
- ✅ Производительность соответствует требованиям:
  - Загрузка страницы < 2 секунды
  - Ответ API < 500 мс (средний)
  - AI запросы < 10 секунд
- ✅ Покрытие кода:
  - Backend > 80%
  - Frontend > 70%
- ✅ Ноль критических багов в production
- ✅ Полная и актуальная документация
- ✅ Команда может поддерживать и расширять кодовую базу
- ✅ Безопасность: RBAC, rate limiting, защита от злоупотреблений
- ✅ Наблюдаемость: логирование, мониторинг, отслеживание ошибок

---

## Снижение Рисков

1. **Риски Миграции Данных:**
   - Комплексная стратегия резервного копирования
   - Тестирование миграции на staging окружении
   - Поэтапная миграция с валидацией
   - Rollback план

2. **Риски Производительности:**
   - Раннее внедрение кеширования
   - Мониторинг метрик производительности
   - Оптимизация запросов к БД (select_related, prefetch_related)
   - CDN для статических файлов

3. **Риски Интеграции:**
   - Регулярные встречи по интеграции
   - Общая тестовая среда
   - Code review процесс
   - API контракты и документация

4. **Риски Сроков:**
   - Приоритизация критических функций (MVP first)
   - Гибкое планирование с буферным временем
   - Еженедельные проверки прогресса
   - Feature flags для постепенного выпуска

5. **Риски Координации Команды:**
   - Ежедневные стендапы (15 минут)
   - Четкие каналы коммуникации (Slack/Discord)
   - Документированные стандарты кода
   - Общий Git workflow (feature branches + PR)

6. **Риски AI Сервисов:**
   - Retry логика с экспоненциальной задержкой
   - Fallback механизмы
   - Мониторинг стоимости и использования
   - Rate limiting для предотвращения злоупотреблений

7. **Риски Безопасности:**
   - Регулярные security аудиты
   - Обновление зависимостей
   - Penetration тестирование перед запуском
   - Bug bounty программа после запуска

---

## Следующие Шаги

1. ✅ Обзор этого плана с командой
2. ✅ Настройка окружений разработки
3. ✅ Создание репозиториев проектов и веток
4. ✅ Настройка CI/CD pipeline
5. ✅ Начало реализации Фазы 1
6. ✅ Планирование регулярных встреч по обзору
7. ✅ Настройка мониторинга и логирования с первого дня
8. ✅ Создание документации по API (Swagger)
9. ✅ Определение стандартов кода и лучших практик

---

## Ключевые Ссылки на Файлы

### Backend
- Модели пользователей: `Unit-school-backend/backend/users/models.py`
- Модели английского: `Unit-school-backend/backend/english/models.py`
- Настройки: `Unit-school-backend/backend/backend/settings.py`
- Представления аутентификации: `Unit-school-backend/backend/users/views.py`

### Frontend
- Профиль: `Unit-school-frontend/src/app/profile/profile-tabs/ProfileTab.jsx`
- AI промпты: `Unit-school-frontend/src/store/prompts/`
- Редактор кода: `Unit-school-frontend/src/app/subjects/computerScience/[subject]/editor/`
- Обратная связь по письму: `Unit-school-frontend/src/app/api/writing-feedback/route.js`
- Сервис аутентификации: `Unit-school-frontend/src/services/djangoAuth.js`

---

*Этот план является живым документом и должен обновляться по мере развития проекта.*
