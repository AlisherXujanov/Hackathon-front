# UnitSchool - Полная Реконструкция | Часть 1
## План Внедрения

## Обзор

Данный документ представляет собой профессиональное руководство по полной реконструкции платформы UnitSchool с нуля, используя современный стек технологий: Next.js 15, Tailwind CSS, SCSS, Django DRF и JWT-аутентификацию. Вся бэкенд-функциональность будет реализована на Django, фронтенд будет взаимодействовать с API Django REST Framework. Проект разрабатывается командой из 4 разработчиков.

## Архитектурный Обзор

```
┌─────────────────────────────────────────────────────────────┐
│                  Фронтенд (Next.js 15)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tailwind   │  │     SCSS     │  │  React Icons │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          │
                    HTTP/REST API (v1)
                          │
┌─────────────────────────────────────────────────────────────┐
│            Бэкенд (Django + DRF + JWT)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Пользователи │  │  Английский  │  │  IT/Код      │      │
│  │    Классы    │  │  Прогресс    │  │  Задачи      │      │
│  │    Баллы     │  │  Аналитика   │  │  Sandbox     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          │
                Фоновые Задачи (Celery + Redis)
                          │
┌─────────────────────────────────────────────────────────────┐
│                  AI Сервисы (3 модели)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Английский  │  │  Английский  │  │  Coding      │      │
│  │  Writing     │  │  Grammar     │  │  AI Agent    │      │
│  │  Model       │  │  Model       │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## КРИТИЧЕСКИ ВАЖНО: Безопасность и Разрешения

### Ролевая Модель Доступа (RBAC)

**Роли в системе:**

1. **Студент (Student)**
   - Доступ к учебным материалам
   - Просмотр собственного прогресса
   - Участие в классах
   - Взаимодействие с AI-ассистентами
   - Просмотр собственного профиля и баллов

2. **Преподаватель (Teacher)**
   - Все права студента
   - Создание и управление классами
   - Просмотр активности студентов своих классов
   - Генерация отчётов по своим классам
   - Приглашение студентов в классы

3. **Администратор (Admin)**
   - Полный доступ ко всем функциям
   - Управление пользователями
   - Доступ ко всем классам и данным
   - Настройка системы
   - Управление контентом

### Реализация Разрешений Django

**Backend (`backend/core/permissions.py`):**

```python
from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    """Только студенты"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsTeacher(permissions.BasePermission):
    """Только преподаватели"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'

class IsTeacherOrReadOnly(permissions.BasePermission):
    """Преподаватели - полный доступ, остальные - только чтение"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'teacher'

class IsOwnerOrTeacher(permissions.BasePermission):
    """Владелец объекта или преподаватель"""
    def has_object_permission(self, request, view, obj):
        # Преподаватель всегда имеет доступ
        if request.user.role == 'teacher':
            return True
        # Студент видит только свои данные
        return obj.user == request.user

class IsClassTeacher(permissions.BasePermission):
    """Только преподаватель данного класса"""
    def has_object_permission(self, request, view, obj):
        return obj.teacher == request.user
```

**Применение в Views:**

```python
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsTeacher, IsClassTeacher

class ClassViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTeacher]
    
    def get_queryset(self):
        # Преподаватели видят только свои классы
        if self.request.user.role == 'teacher':
            return Class.objects.filter(teacher=self.request.user)
        # Администраторы видят все классы
        return Class.objects.all()

class StudentActivityView(APIView):
    permission_classes = [IsAuthenticated, IsClassTeacher]
    
    def get(self, request, class_id, student_id):
        # Проверка доступа на уровне объекта
        class_obj = get_object_or_404(Class, id=class_id)
        self.check_object_permissions(request, class_obj)
        # ... логика
```

### Ограничение Скорости (Rate Limiting)

**Установка:**
```bash
pip install django-ratelimit
```

**Backend (`backend/core/ratelimit.py`):**

```python
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view

# AI endpoints - строгое ограничение
@ratelimit(key='user', rate='10/h', method='POST')
@api_view(['POST'])
def ai_writing_feedback(request):
    # AI запрос стоит дорого
    pass

# Обычные endpoints - мягкое ограничение
@ratelimit(key='user', rate='100/h', method='POST')
@api_view(['POST'])
def submit_exercise(request):
    pass

# Публичные endpoints - по IP
@ratelimit(key='ip', rate='30/m', method='GET')
@api_view(['GET'])
def public_content(request):
    pass
```

**Настройки (`settings.py`):**

```python
RATELIMIT_ENABLE = True  # False для тестирования
RATELIMIT_USE_CACHE = 'default'  # Redis cache

# Кастомные ключи
def user_or_ip(group, request):
    if request.user.is_authenticated:
        return f"user:{request.user.id}"
    return f"ip:{request.META.get('REMOTE_ADDR')}"
```

### Предотвращение Злоупотреблений AI

**Backend (`backend/ai/middleware.py`):**

```python
class AIUsageMiddleware:
    """Отслеживание использования AI"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Проверка лимита AI запросов
        if request.path.startswith('/api/ai/'):
            user_usage = AIUsage.objects.get_or_create(
                user=request.user,
                date=timezone.now().date()
            )[0]
            
            # Максимум 50 AI запросов в день
            if user_usage.count >= 50:
                return JsonResponse({
                    'error': 'Daily AI limit exceeded'
                }, status=429)
            
            user_usage.count += 1
            user_usage.save()
        
        return self.get_response(request)
```

**Model (`backend/ai/models.py`):**

```python
class AIUsage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    count = models.IntegerField(default=0)
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    
    class Meta:
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]
```

---

## Управление API и Версионирование

### Стратегия Версионирования API

**Структура URL:**
```
/api/v1/users/
/api/v1/english/grammar/
/api/v1/programming/tasks/
/api/v2/...  # будущие версии
```

**Backend (`backend/backend/urls.py`):**

```python
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('auth/', include('users.urls')),
        path('users/', include('users.api_urls')),
        path('english/', include('english.urls')),
        path('programming/', include('programming.urls')),
        path('classes/', include('classes.urls')),
        path('points/', include('points.urls')),
        path('leaderboard/', include('leaderboard.urls')),
        path('analytics/', include('analytics.urls')),
        path('ai/', include('ai.urls')),
    ])),
]
```

### Стандартизированный Формат Ответов

**Успешный ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example"
  },
  "meta": {
    "timestamp": "2026-01-20T12:00:00Z",
    "version": "1.0"
  }
}
```

**Ответ с ошибкой:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["This field is required"]
    }
  },
  "meta": {
    "timestamp": "2026-01-20T12:00:00Z",
    "version": "1.0"
  }
}
```

**Backend (`backend/core/response.py`):**

```python
from rest_framework.response import Response
from django.utils import timezone

class StandardResponse:
    @staticmethod
    def success(data, status=200, meta=None):
        response_data = {
            'success': True,
            'data': data,
            'meta': {
                'timestamp': timezone.now().isoformat(),
                'version': '1.0',
                **(meta or {})
            }
        }
        return Response(response_data, status=status)
    
    @staticmethod
    def error(message, code='ERROR', details=None, status=400):
        response_data = {
            'success': False,
            'error': {
                'code': code,
                'message': message,
                'details': details or {}
            },
            'meta': {
                'timestamp': timezone.now().isoformat(),
                'version': '1.0'
            }
        }
        return Response(response_data, status=status)
```

### HTTP Статус-коды

**Стандартизированное использование:**

- `200 OK` - Успешный GET, PUT, PATCH
- `201 Created` - Успешный POST (создание ресурса)
- `204 No Content` - Успешный DELETE
- `400 Bad Request` - Ошибка валидации данных
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Нет прав доступа
- `404 Not Found` - Ресурс не найден
- `409 Conflict` - Конфликт данных (дубликаты)
- `422 Unprocessable Entity` - Логическая ошибка
- `429 Too Many Requests` - Превышен лимит запросов
- `500 Internal Server Error` - Серверная ошибка

### OpenAPI / Swagger Документация

**Установка:**
```bash
pip install drf-spectacular
```

**Backend (`backend/backend/settings.py`):**

```python
INSTALLED_APPS = [
    # ...
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'UnitSchool API',
    'DESCRIPTION': 'Comprehensive learning platform API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SCHEMA_PATH_PREFIX': '/api/v1/',
    'COMPONENT_SPLIT_REQUEST': True,
}
```

**Backend (`backend/backend/urls.py`):**

```python
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # ...
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

**Доступ к документации:**
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

**Аннотация Views:**

```python
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

class TaskViewSet(viewsets.ModelViewSet):
    @extend_schema(
        summary="Список задач программирования",
        description="Получить список задач с фильтрацией по сложности и языку",
        parameters=[
            OpenApiParameter(
                name='difficulty',
                type=OpenApiTypes.STR,
                enum=['beginner', 'intermediate', 'advanced'],
                description='Уровень сложности'
            ),
            OpenApiParameter(
                name='language',
                type=OpenApiTypes.STR,
                description='Язык программирования'
            ),
        ],
        responses={200: TaskSerializer(many=True)}
    )
    def list(self, request):
        pass
```

---

## Фоновая Обработка и Асинхронные Задачи

### Celery + Redis

**Установка:**
```bash
pip install celery redis django-celery-beat django-celery-results
```

**Backend (`backend/backend/celery.py`):**

```python
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('unitschool')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Периодические задачи
app.conf.beat_schedule = {
    'reset-daily-points': {
        'task': 'points.tasks.reset_daily_points',
        'schedule': crontab(hour=0, minute=0),  # Полночь каждый день
    },
    'update-leaderboard-daily': {
        'task': 'leaderboard.tasks.update_daily_leaderboard',
        'schedule': crontab(hour=0, minute=5),
    },
    'update-leaderboard-weekly': {
        'task': 'leaderboard.tasks.update_weekly_leaderboard',
        'schedule': crontab(day_of_week=1, hour=0, minute=10),  # Понедельник
    },
    'update-leaderboard-monthly': {
        'task': 'leaderboard.tasks.update_monthly_leaderboard',
        'schedule': crontab(day_of_month=1, hour=0, minute=15),  # 1-е число месяца
    },
    'aggregate-analytics': {
        'task': 'analytics.tasks.aggregate_daily_analytics',
        'schedule': crontab(hour=1, minute=0),  # 1:00 каждый день
    },
    'clean-old-activity-logs': {
        'task': 'analytics.tasks.clean_old_logs',
        'schedule': crontab(day_of_week=0, hour=2, minute=0),  # Воскресенье 2:00
    },
}

app.conf.timezone = 'UTC'
```

**Backend (`backend/backend/settings.py`):**

```python
# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'default'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 минут
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60  # 25 минут
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000  # Перезапуск worker после 1000 задач

# Redis Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

### Примеры Задач

**Backend (`backend/points/tasks.py`):**

```python
from celery import shared_task
from django.utils import timezone
from .models import Points

@shared_task(bind=True, max_retries=3)
def reset_daily_points(self):
    """Сброс ежедневных баллов в полночь"""
    try:
        today = timezone.now().date()
        Points.objects.filter(last_daily_reset__lt=today).update(
            daily_points=0,
            last_daily_reset=today
        )
        return f"Daily points reset for {today}"
    except Exception as exc:
        # Повтор через 5 минут
        raise self.retry(exc=exc, countdown=300)

@shared_task
def award_points_async(user_id, points, reason, activity_type):
    """Асинхронное начисление баллов"""
    from users.models import CustomUser
    from .models import Points, PointsHistory
    
    user = CustomUser.objects.get(id=user_id)
    points_obj, _ = Points.objects.get_or_create(user=user)
    
    points_obj.total_points += points
    points_obj.daily_points += points
    points_obj.save()
    
    # История
    PointsHistory.objects.create(
        user=user,
        points=points,
        reason=reason,
        activity_type=activity_type
    )
```

**Backend (`backend/leaderboard/tasks.py`):**

```python
from celery import shared_task
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import LeaderboardEntry
from points.models import PointsHistory

@shared_task
def update_daily_leaderboard():
    """Обновление ежедневного рейтинга"""
    today = timezone.now().date()
    
    # Агрегация баллов за сегодня
    daily_points = PointsHistory.objects.filter(
        created_at__date=today
    ).values('user').annotate(
        total=Sum('points')
    ).order_by('-total')
    
    # Обновление рейтинга
    LeaderboardEntry.objects.filter(
        period_type='daily',
        period_date=today
    ).delete()
    
    entries = []
    for rank, item in enumerate(daily_points, start=1):
        entries.append(LeaderboardEntry(
            user_id=item['user'],
            period_type='daily',
            period_date=today,
            points=item['total'],
            rank=rank
        ))
    
    LeaderboardEntry.objects.bulk_create(entries)
    return f"Updated {len(entries)} daily leaderboard entries"

@shared_task
def update_weekly_leaderboard():
    """Обновление недельного рейтинга"""
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    
    weekly_points = PointsHistory.objects.filter(
        created_at__date__gte=week_start
    ).values('user').annotate(
        total=Sum('points')
    ).order_by('-total')
    
    # Аналогично daily
    # ...

@shared_task
def update_monthly_leaderboard():
    """Обновление месячного рейтинга"""
    today = timezone.now().date()
    month_start = today.replace(day=1)
    
    # Аналогично weekly
    # ...
```

**Backend (`backend/analytics/tasks.py`):**

```python
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import ActivityLog

@shared_task
def aggregate_daily_analytics():
    """Агрегация аналитики за день"""
    from .models import DailyAnalytics
    
    yesterday = timezone.now().date() - timedelta(days=1)
    
    # Агрегация по пользователям
    users_data = ActivityLog.objects.filter(
        created_at__date=yesterday
    ).values('user').annotate(
        total_duration=Sum('duration_minutes'),
        activity_count=Count('id')
    )
    
    analytics = []
    for data in users_data:
        analytics.append(DailyAnalytics(
            user_id=data['user'],
            date=yesterday,
            total_duration=data['total_duration'],
            activity_count=data['activity_count']
        ))
    
    DailyAnalytics.objects.bulk_create(analytics, ignore_conflicts=True)
    return f"Aggregated analytics for {yesterday}"

@shared_task
def clean_old_logs():
    """Очистка старых логов (старше 90 дней)"""
    cutoff_date = timezone.now() - timedelta(days=90)
    deleted_count = ActivityLog.objects.filter(
        created_at__lt=cutoff_date
    ).delete()[0]
    
    return f"Deleted {deleted_count} old activity logs"
```

**Backend (`backend/ai/tasks.py`):**

```python
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def process_ai_request(self, user_id, request_type, data):
    """Асинхронная обработка AI запроса"""
    try:
        from .services import AIService
        
        result = AIService.process_request(
            user_id=user_id,
            request_type=request_type,
            data=data
        )
        
        return result
        
    except Exception as exc:
        logger.error(f"AI request failed: {exc}")
        # Экспоненциальная задержка: 60, 120, 240 секунд
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
```

### Запуск Celery

**Development:**
```bash
# Worker
celery -A backend worker -l info

# Beat (планировщик)
celery -A backend beat -l info

# Flower (мониторинг)
celery -A backend flower
```

**Production (systemd):**

`/etc/systemd/system/celery.service`:
```ini
[Unit]
Description=Celery Service
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
EnvironmentFile=/path/to/.env
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/celery -A backend worker --detach --pidfile=/var/run/celery.pid
ExecStop=/bin/kill -s TERM $MAINPID

[Install]
WantedBy=multi-user.target
```

---

## Фаза 1: Основа и Настройка

### 1.1 Настройка Структуры Проекта

**Фронтенд:**

Структура уже существует в `Unit-school-frontend`

**Необходимые действия:**

```bash
cd Unit-school-frontend

# Установка Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Конфигурация Tailwind (`tailwind.config.js`):**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... остальные оттенки
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

**Добавление Tailwind в SCSS (`src/app/globals.scss`):**

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

// Существующие SCSS стили
// ...
```

**Переменные окружения (`.env.local`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_TOGETHER_AI_KEY=your_key_here
```

**Бэкенд:**

Структура уже существует в `Unit-school-backend/backend/`

**Проверка зависимостей (`requirements.txt`):**

```txt
Django==5.2.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-decouple==3.8
celery==5.3.4
redis==5.0.1
django-celery-beat==2.5.0
django-celery-results==2.5.1
django-redis==5.4.0
django-ratelimit==4.1.0
drf-spectacular==0.27.0
Pillow==10.1.0
pytest==7.4.3
pytest-django==4.7.0
```

**Переменные окружения (`.env`):**

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/unitschool
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60  # минуты
JWT_REFRESH_TOKEN_LIFETIME=1440  # минуты (1 день)

# Together AI
TOGETHER_AI_KEY=your_together_ai_key

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=django-db

# Redis
REDIS_URL=redis://localhost:6379/1
```

**Git настройка (`.gitignore`):**

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
*.egg-info/

# Django
*.log
db.sqlite3
media/
staticfiles/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### 1.2 Проектирование Схемы Базы Данных

**Существующие Модели (требуют улучшения):**

1. `CustomUser` - `Unit-school-backend/backend/users/models.py`
2. `UserProfile` - `Unit-school-backend/backend/users/models.py`
3. `Progress` - `Unit-school-backend/backend/english/models.py`

**Улучшение CustomUser:**

```python
# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('teacher', 'Преподаватель'),
        ('admin', 'Администратор'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]
```

**Улучшение UserProfile:**

```python
# backend/users/models.py (продолжение)
class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    
    # Личная информация
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    # Настройки
    is_profile_public = models.BooleanField(default=False)
    language_preference = models.CharField(max_length=10, default='uz')
    theme = models.CharField(max_length=10, default='light')
    
    # Активность
    last_activity_date = models.DateField(null=True, blank=True)
    streak_days = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    
    # Статистика
    total_learning_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    lessons_completed = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        
    def update_streak(self):
        """Обновление серии"""
        from django.utils import timezone
        today = timezone.now().date()
        
        if self.last_activity_date:
            days_diff = (today - self.last_activity_date).days
            
            if days_diff == 1:
                # Продолжение серии
                self.streak_days += 1
                if self.streak_days > self.longest_streak:
                    self.longest_streak = self.streak_days
            elif days_diff > 1:
                # Серия прервана
                self.streak_days = 1
        else:
            # Первый день
            self.streak_days = 1
        
        self.last_activity_date = today
        self.save()
```

**Новые Модели:**

**1. Управление Классами (`backend/classes/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class Class(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='taught_classes'
    )
    invite_code = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'classes'
        verbose_name_plural = 'Classes'
        indexes = [
            models.Index(fields=['teacher', 'is_active']),
            models.Index(fields=['invite_code']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.teacher.get_full_name()}"

class ClassMembership(models.Model):
    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('assistant', 'Ассистент'),
    ]
    
    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='class_memberships'
    )
    class_obj = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'class_memberships'
        unique_together = ['student', 'class_obj']
        indexes = [
            models.Index(fields=['class_obj', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.student.username} in {self.class_obj.name}"

class ClassInvitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('accepted', 'Принято'),
        ('rejected', 'Отклонено'),
    ]
    
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    email = models.EmailField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    invited_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    invited_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'class_invitations'
        unique_together = ['class_obj', 'email']
```

**2. Задачи по Программированию (`backend/programming/models.py`):**

```python
from django.db import models
from users.models import CustomUser

class Task(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Начинающий'),
        ('intermediate', 'Средний'),
        ('advanced', 'Продвинутый'),
    ]
    
    TYPE_CHOICES = [
        ('multiple_choice', 'Множественный выбор'),
        ('coding', 'Написание кода'),
    ]
    
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('html', 'HTML'),
        ('css', 'CSS'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    task_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # JSON поле для хранения контента
    content = models.JSONField()
    # Для multiple_choice: {"question": "...", "options": [...], "correct": 0}
    # Для coding: {"starter_code": "...", "instructions": "..."}
    
    # Тестовые случаи (только для coding)
    test_cases = models.JSONField(null=True, blank=True)
    # [{"input": "...", "expected_output": "...", "is_hidden": false}, ...]
    
    # Решение (необязательно)
    solution = models.TextField(blank=True)
    
    points = models.IntegerField(default=20)
    time_limit_seconds = models.IntegerField(default=300)  # 5 минут
    
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'programming_tasks'
        indexes = [
            models.Index(fields=['difficulty', 'language']),
            models.Index(fields=['is_published']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.difficulty})"

class TaskSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('passed', 'Пройдено'),
        ('failed', 'Не пройдено'),
        ('error', 'Ошибка'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    
    # Код или ответы
    code = models.TextField(blank=True)  # Для coding
    answers = models.JSONField(null=True, blank=True)  # Для multiple_choice
    
    # Результаты
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    test_results = models.JSONField(null=True, blank=True)
    # [{"test_id": 1, "passed": true, "output": "...", "error": null}, ...]
    
    score = models.IntegerField(default=0)
    execution_time_ms = models.IntegerField(null=True, blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'task_submissions'
        indexes = [
            models.Index(fields=['user', 'task']),
            models.Index(fields=['status']),
        ]
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.task.title} ({self.status})"
```

*Продолжение в Части 2...*