export const programmingCategories = {
  LANGUAGES: 'languages',
  FRAMEWORKS: 'frameworks',
  LIBRARIES: 'libraries',
}

export const programmingLevels = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

export const lessons = [
  // Languages - Python
  {
    id: 'python-basics',
    title: 'Основы Python',
    category: programmingCategories.LANGUAGES,
    language: 'Python',
    level: programmingLevels.BEGINNER,
    duration: 45,
    description: 'Изучите основы Python: синтаксис, переменные, типы данных, операторы и базовые структуры данных.',
    theory: `# Основы Python

Python — это высокоуровневый язык программирования, известный своей простотой и читаемостью.

## Переменные и типы данных

В Python не нужно явно объявлять тип переменной:

\`\`\`python
name = "Иван"  # строка
age = 25       # целое число
height = 1.75  # число с плавающей точкой
is_student = True  # булево значение
\`\`\`

## Основные типы данных

- **int** — целые числа (1, 42, -10)
- **float** — числа с плавающей точкой (3.14, 2.5)
- **str** — строки ("Hello", 'World')
- **bool** — булевы значения (True, False)
- **list** — списки [1, 2, 3]
- **dict** — словари {"key": "value"}

## Операторы

\`\`\`python
# Арифметические
a = 10 + 5    # 15
b = 10 - 5    # 5
c = 10 * 5    # 50
d = 10 / 5    # 2.0
e = 10 ** 2   # 100 (возведение в степень)

# Сравнения
x = 10 > 5    # True
y = 10 == 5   # False
z = 10 != 5   # True
\`\`\`

## Списки и словари

\`\`\`python
# Список
fruits = ["яблоко", "банан", "апельсин"]
fruits.append("груша")  # добавить элемент
print(fruits[0])  # "яблоко"

# Словарь
person = {
    "имя": "Иван",
    "возраст": 25,
    "город": "Москва"
}
print(person["имя"])  # "Иван"
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную name со значением "Python" и выведите её на экран.',
        solution: 'name = "Python"\nprint(name)',
        hint: 'Используйте функцию print() для вывода.',
      },
      {
        id: 'ex2',
        type: 'code',
        question: 'Создайте список numbers с числами от 1 до 5 и выведите первый элемент.',
        solution: 'numbers = [1, 2, 3, 4, 5]\nprint(numbers[0])',
        hint: 'Первый элемент списка имеет индекс 0.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Какой тип данных у переменной x = 3.14?',
          options: ['int', 'float', 'str', 'bool'],
          correct: 1,
        },
        {
          id: 'q2',
          question: 'Как получить первый элемент списка my_list?',
          options: ['my_list[1]', 'my_list[0]', 'my_list.first', 'my_list.get(0)'],
          correct: 1,
        },
        {
          id: 'q3',
          question: 'Что выведет print(10 // 3)?',
          options: ['3.33', '3', '4', 'Ошибка'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'python-functions',
    title: 'Функции в Python',
    category: programmingCategories.LANGUAGES,
    language: 'Python',
    level: programmingLevels.BEGINNER,
    duration: 50,
    description: 'Изучите создание и использование функций, параметры, возвращаемые значения и область видимости.',
    theory: `# Функции в Python

Функции позволяют группировать код для повторного использования.

## Определение функции

\`\`\`python
def greet(name):
    return f"Привет, {name}!"

result = greet("Иван")
print(result)  # "Привет, Иван!"
\`\`\`

## Параметры по умолчанию

\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))      # 9 (3^2)
print(power(3, 3))   # 27 (3^3)
\`\`\`

## Лямбда-функции

\`\`\`python
square = lambda x: x ** 2
print(square(5))  # 25
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте функцию add, которая принимает два числа и возвращает их сумму.',
        solution: 'def add(a, b):\n    return a + b',
        hint: 'Используйте ключевое слово return для возврата значения.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Как правильно определить функцию?',
          options: ['function my_func():', 'def my_func():', 'func my_func():', 'my_func = function():'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'python-loops',
    title: 'Циклы в Python',
    category: programmingCategories.LANGUAGES,
    language: 'Python',
    level: programmingLevels.BEGINNER,
    duration: 40,
    description: 'Изучите циклы for и while, итерацию по коллекциям и управление потоком выполнения.',
    theory: `# Циклы в Python

Циклы позволяют выполнять код многократно.

## Цикл for

\`\`\`python
fruits = ["яблоко", "банан", "апельсин"]
for fruit in fruits:
    print(fruit)
\`\`\`

## Цикл while

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Управление циклами

\`\`\`python
# break — выход из цикла
for i in range(10):
    if i == 5:
        break
    print(i)

# continue — пропуск итерации
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Используя цикл for, выведите числа от 1 до 10.',
        solution: 'for i in range(1, 11):\n    print(i)',
        hint: 'Используйте range(1, 11) для генерации чисел.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что выведет: for i in range(3): print(i)',
          options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', 'Ошибка'],
          correct: 0,
        },
      ],
    },
  },
  {
    id: 'python-classes',
    title: 'Классы и объекты',
    category: programmingCategories.LANGUAGES,
    language: 'Python',
    level: programmingLevels.INTERMEDIATE,
    duration: 60,
    description: 'Изучите объектно-ориентированное программирование: классы, объекты, наследование и инкапсуляция.',
    theory: `# Классы и объекты в Python

Классы позволяют создавать собственные типы данных.

## Определение класса

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Меня зовут {self.name}, мне {self.age} лет"

person = Person("Иван", 25)
print(person.introduce())
\`\`\`

## Наследование

\`\`\`python
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте класс Car с атрибутами brand и model, и методом get_info().',
        solution: 'class Car:\n    def __init__(self, brand, model):\n        self.brand = brand\n        self.model = model\n    \n    def get_info(self):\n        return f"{self.brand} {self.model}"',
        hint: 'Используйте __init__ для инициализации атрибутов.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Какой метод вызывается при создании объекта?',
          options: ['__new__', '__init__', '__create__', '__start__'],
          correct: 1,
        },
      ],
    },
  },

  // Languages - JavaScript
  {
    id: 'javascript-basics',
    title: 'Основы JavaScript',
    category: programmingCategories.LANGUAGES,
    language: 'JavaScript',
    level: programmingLevels.BEGINNER,
    duration: 50,
    description: 'Изучите основы JavaScript: переменные, типы данных, операторы и базовый синтаксис.',
    theory: `# Основы JavaScript

JavaScript — язык программирования для веб-разработки.

## Переменные

\`\`\`javascript
// let — изменяемая переменная
let name = "Иван";
name = "Петр";

// const — константа
const age = 25;

// var — устаревший способ (не рекомендуется)
var city = "Москва";
\`\`\`

## Типы данных

\`\`\`javascript
let number = 42;           // число
let text = "Hello";        // строка
let isActive = true;       // булево
let data = null;           // null
let value;                 // undefined
let arr = [1, 2, 3];       // массив
let obj = {key: "value"};  // объект
\`\`\`

## Операторы

\`\`\`javascript
// Арифметические
let sum = 10 + 5;
let diff = 10 - 5;
let prod = 10 * 5;
let quot = 10 / 5;
let mod = 10 % 3;  // остаток от деления

// Сравнения
let isGreater = 10 > 5;   // true
let isEqual = 10 === 5;   // false (строгое сравнение)
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную message со значением "Hello, World!" и выведите её в консоль.',
        solution: 'const message = "Hello, World!";\nconsole.log(message);',
        hint: 'Используйте console.log() для вывода.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'В чем разница между let и const?',
          options: ['Нет разницы', 'let можно изменять, const нельзя', 'const быстрее', 'let устарел'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'javascript-functions',
    title: 'Функции в JavaScript',
    category: programmingCategories.LANGUAGES,
    language: 'JavaScript',
    level: programmingLevels.BEGINNER,
    duration: 45,
    description: 'Изучите различные способы создания функций: function declaration, arrow functions и методы.',
    theory: `# Функции в JavaScript

## Function Declaration

\`\`\`javascript
function greet(name) {
    return \`Привет, \${name}!\`;
}
\`\`\`

## Arrow Functions

\`\`\`javascript
const greet = (name) => {
    return \`Привет, \${name}!\`;
};

// Короткая форма
const square = x => x * x;
\`\`\`

## Callbacks

\`\`\`javascript
function processData(data, callback) {
    const result = data * 2;
    callback(result);
}

processData(5, (result) => {
    console.log(result);  // 10
});
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте arrow function multiply, которая принимает два числа и возвращает их произведение.',
        solution: 'const multiply = (a, b) => a * b;',
        hint: 'Arrow function можно записать в одну строку без return.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое arrow function?',
          options: ['Новый тип данных', 'Сокращенный синтаксис функции', 'Метод массива', 'Ошибка'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'javascript-dom',
    title: 'Работа с DOM',
    category: programmingCategories.LANGUAGES,
    language: 'JavaScript',
    level: programmingLevels.INTERMEDIATE,
    duration: 55,
    description: 'Изучите манипуляции с DOM: выбор элементов, изменение содержимого, обработка событий.',
    theory: `# Работа с DOM

DOM (Document Object Model) — представление HTML-документа в виде дерева объектов.

## Выбор элементов

\`\`\`javascript
// По ID
const element = document.getElementById('myId');

// По классу
const elements = document.getElementsByClassName('myClass');

// По селектору (современный способ)
const el = document.querySelector('#myId');
const all = document.querySelectorAll('.myClass');
\`\`\`

## Изменение содержимого

\`\`\`javascript
element.textContent = "Новый текст";
element.innerHTML = "<strong>Жирный текст</strong>";
element.setAttribute('class', 'new-class');
\`\`\`

## Обработка событий

\`\`\`javascript
button.addEventListener('click', () => {
    console.log('Кнопка нажата!');
});
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Выберите элемент с id="title" и измените его текст на "Новый заголовок".',
        solution: 'const title = document.getElementById("title");\ntitle.textContent = "Новый заголовок";',
        hint: 'Используйте getElementById и textContent.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Какой метод используется для выбора элемента по ID?',
          options: ['getElementById', 'querySelector', 'getElement', 'Оба первых варианта'],
          correct: 3,
        },
      ],
    },
  },

  // Languages - Java
  {
    id: 'java-basics',
    title: 'Основы Java',
    category: programmingCategories.LANGUAGES,
    language: 'Java',
    level: programmingLevels.BEGINNER,
    duration: 60,
    description: 'Изучите основы Java: синтаксис, переменные, типы данных и структура программы.',
    theory: `# Основы Java

Java — объектно-ориентированный язык программирования.

## Структура программы

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

## Переменные и типы

\`\`\`java
int age = 25;                    // целое число
double height = 1.75;            // число с плавающей точкой
String name = "Иван";            // строка
boolean isStudent = true;         // булево значение
\`\`\`

## Массивы

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[3];
names[0] = "Иван";
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную message типа String со значением "Hello, Java!" и выведите её.',
        solution: 'String message = "Hello, Java!";\nSystem.out.println(message);',
        hint: 'Используйте System.out.println() для вывода.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Какой тип данных используется для строк в Java?',
          options: ['string', 'String', 'str', 'text'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'java-oop',
    title: 'ООП в Java',
    category: programmingCategories.LANGUAGES,
    language: 'Java',
    level: programmingLevels.INTERMEDIATE,
    duration: 70,
    description: 'Изучите объектно-ориентированное программирование: классы, объекты, наследование, полиморфизм.',
    theory: `# ООП в Java

## Классы и объекты

\`\`\`java
public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("Меня зовут " + name);
    }
}
\`\`\`

## Наследование

\`\`\`java
public class Student extends Person {
    private String studentId;
    
    public Student(String name, int age, String studentId) {
        super(name, age);
        this.studentId = studentId;
    }
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте класс Car с полями brand и model, конструктором и методом getInfo().',
        solution: 'public class Car {\n    private String brand;\n    private String model;\n    \n    public Car(String brand, String model) {\n        this.brand = brand;\n        this.model = model;\n    }\n    \n    public String getInfo() {\n        return brand + " " + model;\n    }\n}',
        hint: 'Используйте this для обращения к полям класса.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что означает ключевое слово extends?',
          options: ['Расширение', 'Наследование', 'Импорт', 'Экспорт'],
          correct: 1,
        },
      ],
    },
  },

  // Languages - C++
  {
    id: 'cpp-basics',
    title: 'Основы C++',
    category: programmingCategories.LANGUAGES,
    language: 'C++',
    level: programmingLevels.BEGINNER,
    duration: 55,
    description: 'Изучите основы C++: синтаксис, переменные, указатели и базовые структуры данных.',
    theory: `# Основы C++

C++ — компилируемый язык программирования общего назначения.

## Структура программы

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

## Переменные и типы

\`\`\`cpp
int age = 25;              // целое число
double height = 1.75;      // число с плавающей точкой
char grade = 'A';          // символ
string name = "Иван";      // строка
bool isActive = true;      // булево значение
\`\`\`

## Указатели

\`\`\`cpp
int value = 42;
int* ptr = &value;  // указатель на value
cout << *ptr;       // разыменование: 42
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную number типа int со значением 10 и выведите её.',
        solution: '#include <iostream>\nusing namespace std;\nint main() {\n    int number = 10;\n    cout << number << endl;\n    return 0;\n}',
        hint: 'Используйте cout для вывода.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое указатель в C++?',
          options: ['Тип данных', 'Переменная, хранящая адрес', 'Функция', 'Класс'],
          correct: 1,
        },
      ],
    },
  },

  // Languages - Go
  {
    id: 'go-basics',
    title: 'Основы Go',
    category: programmingCategories.LANGUAGES,
    language: 'Go',
    level: programmingLevels.INTERMEDIATE,
    duration: 50,
    description: 'Изучите основы Go: синтаксис, горутины, каналы и особенности языка.',
    theory: `# Основы Go

Go — язык программирования от Google, известный простотой и производительностью.

## Структура программы

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
\`\`\`

## Переменные

\`\`\`go
var name string = "Иван"
age := 25  // короткое объявление
height := 1.75
\`\`\`

## Горутины

\`\`\`go
go func() {
    fmt.Println("Выполняется в отдельной горутине")
}()
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную message со значением "Hello, Go!" и выведите её.',
        solution: 'package main\nimport "fmt"\nfunc main() {\n    message := "Hello, Go!"\n    fmt.Println(message)\n}',
        hint: 'Используйте := для короткого объявления переменной.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое горутина в Go?',
          options: ['Функция', 'Легковесный поток', 'Переменная', 'Тип данных'],
          correct: 1,
        },
      ],
    },
  },

  // Languages - Rust
  {
    id: 'rust-basics',
    title: 'Основы Rust',
    category: programmingCategories.LANGUAGES,
    language: 'Rust',
    level: programmingLevels.ADVANCED,
    duration: 65,
    description: 'Изучите основы Rust: ownership, borrowing, lifetimes и безопасность памяти.',
    theory: `# Основы Rust

Rust — язык системного программирования с фокусом на безопасность.

## Ownership

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1;  // s1 больше не валидна (move)
// println!("{}", s1);  // ошибка!
\`\`\`

## Borrowing

\`\`\`rust
let s = String::from("hello");
let len = calculate_length(&s);  // передача ссылки

fn calculate_length(s: &String) -> usize {
    s.len()
}
\`\`\`

## Переменные

\`\`\`rust
let x = 5;           // неизменяемая
let mut y = 10;      // изменяемая
const MAX: u32 = 100; // константа
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте изменяемую переменную count со значением 0 и увеличьте её на 1.',
        solution: 'let mut count = 0;\ncount += 1;',
        hint: 'Используйте mut для изменяемой переменной.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое ownership в Rust?',
          options: ['Владение памятью', 'Тип данных', 'Функция', 'Модуль'],
          correct: 0,
        },
      ],
    },
  },

  // Languages - TypeScript
  {
    id: 'typescript-basics',
    title: 'Основы TypeScript',
    category: programmingCategories.LANGUAGES,
    language: 'TypeScript',
    level: programmingLevels.INTERMEDIATE,
    duration: 55,
    description: 'Изучите TypeScript: типы, интерфейсы, дженерики и преимущества типизации.',
    theory: `# Основы TypeScript

TypeScript — типизированная надстройка над JavaScript.

## Типы

\`\`\`typescript
let name: string = "Иван";
let age: number = 25;
let isActive: boolean = true;
let data: any = "любой тип";
\`\`\`

## Интерфейсы

\`\`\`typescript
interface Person {
    name: string;
    age: number;
    email?: string;  // опциональное поле
}

const person: Person = {
    name: "Иван",
    age: 25
};
\`\`\`

## Дженерики

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}

let output = identity<string>("hello");
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте интерфейс User с полями name (string) и age (number).',
        solution: 'interface User {\n    name: string;\n    age: number;\n}',
        hint: 'Используйте ключевое слово interface.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое TypeScript?',
          options: ['Новый язык', 'Типизированный JavaScript', 'Библиотека', 'Фреймворк'],
          correct: 1,
        },
      ],
    },
  },

  // Languages - PHP
  {
    id: 'php-basics',
    title: 'Основы PHP',
    category: programmingCategories.LANGUAGES,
    language: 'PHP',
    level: programmingLevels.BEGINNER,
    duration: 45,
    description: 'Изучите основы PHP: синтаксис, переменные, массивы и работа с формами.',
    theory: `# Основы PHP

PHP — серверный язык программирования для веб-разработки.

## Синтаксис

\`\`\`php
<?php
echo "Hello, World!";
?>
\`\`\`

## Переменные

\`\`\`php
$name = "Иван";
$age = 25;
$isStudent = true;
\`\`\`

## Массивы

\`\`\`php
$fruits = array("яблоко", "банан", "апельсин");
// или короткий синтаксис
$numbers = [1, 2, 3, 4, 5];

// Ассоциативный массив
$person = [
    "name" => "Иван",
    "age" => 25
];
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте переменную $message со значением "Hello, PHP!" и выведите её.',
        solution: '<?php\n$message = "Hello, PHP!";\necho $message;\n?>',
        hint: 'Используйте echo для вывода.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Как начинается переменная в PHP?',
          options: ['$', '@', '#', '&'],
          correct: 0,
        },
      ],
    },
  },

  // Frameworks - React
  {
    id: 'react-basics',
    title: 'Основы React',
    category: programmingCategories.FRAMEWORKS,
    language: 'React',
    level: programmingLevels.INTERMEDIATE,
    duration: 70,
    description: 'Изучите React: компоненты, JSX, props, state и hooks.',
    theory: `# Основы React

React — библиотека для создания пользовательских интерфейсов.

## Компоненты

\`\`\`jsx
function Welcome(props) {
    return <h1>Привет, {props.name}!</h1>;
}

// Использование
<Welcome name="Иван" />
\`\`\`

## Hooks

\`\`\`jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Счет: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Увеличить
            </button>
        </div>
    );
}
\`\`\`

## useEffect

\`\`\`jsx
import { useEffect } from 'react';

useEffect(() => {
    // Выполняется после рендера
    console.log('Компонент отрендерен');
}, [dependencies]);
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте компонент Button, который принимает prop text и отображает кнопку.',
        solution: 'function Button({ text }) {\n    return <button>{text}</button>;\n}',
        hint: 'Используйте деструктуризацию для props.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое JSX?',
          options: ['Язык программирования', 'Синтаксис для описания UI', 'Библиотека', 'Фреймворк'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'react-hooks',
    title: 'React Hooks',
    category: programmingCategories.FRAMEWORKS,
    language: 'React',
    level: programmingLevels.INTERMEDIATE,
    duration: 65,
    description: 'Изучите хуки React: useState, useEffect, useContext, useMemo и кастомные хуки.',
    theory: `# React Hooks

Hooks позволяют использовать состояние и другие возможности React в функциональных компонентах.

## useState

\`\`\`jsx
const [state, setState] = useState(initialValue);
\`\`\`

## useEffect

\`\`\`jsx
useEffect(() => {
    // Побочные эффекты
    return () => {
        // Очистка
    };
}, [dependencies]);
\`\`\`

## useMemo

\`\`\`jsx
const memoizedValue = useMemo(() => {
    return expensiveCalculation(a, b);
}, [a, b]);
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте компонент с useState для хранения имени пользователя.',
        solution: 'import { useState } from "react";\nfunction User() {\n    const [name, setName] = useState("");\n    return <input value={name} onChange={(e) => setName(e.target.value)} />;\n}',
        hint: 'Используйте useState для состояния.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Когда выполняется useEffect без зависимостей?',
          options: ['Никогда', 'При каждом рендере', 'Только при монтировании', 'При изменении props'],
          correct: 2,
        },
      ],
    },
  },
  {
    id: 'react-router',
    title: 'React Router',
    category: programmingCategories.FRAMEWORKS,
    language: 'React',
    level: programmingLevels.INTERMEDIATE,
    duration: 50,
    description: 'Изучите маршрутизацию в React: BrowserRouter, Routes, Route и навигация.',
    theory: `# React Router

React Router — библиотека для маршрутизации в React-приложениях.

## Базовая настройка

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Главная</Link>
                <Link to="/about">О нас</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}
\`\`\`

## useNavigate

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/about');
    };
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте маршрут для страницы /contact с компонентом Contact.',
        solution: '<Route path="/contact" element={<Contact />} />',
        hint: 'Используйте компонент Route внутри Routes.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Какой компонент используется для оборачивания приложения?',
          options: ['Router', 'BrowserRouter', 'Route', 'Routes'],
          correct: 1,
        },
      ],
    },
  },

  // Frameworks - Vue.js
  {
    id: 'vue-basics',
    title: 'Основы Vue.js',
    category: programmingCategories.FRAMEWORKS,
    language: 'Vue.js',
    level: programmingLevels.INTERMEDIATE,
    duration: 60,
    description: 'Изучите Vue.js: компоненты, директивы, реактивность и композиция API.',
    theory: `# Основы Vue.js

Vue.js — прогрессивный фреймворк для создания пользовательских интерфейсов.

## Компонент

\`\`\`vue
<template>
    <div>
        <h1>{{ title }}</h1>
        <button @click="increment">Счет: {{ count }}</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'Привет Vue!',
            count: 0
        }
    },
    methods: {
        increment() {
            this.count++;
        }
    }
}
</script>
\`\`\`

## Директивы

\`\`\`vue
<div v-if="isVisible">Видимый контент</div>
<div v-for="item in items" :key="item.id">{{ item.name }}</div>
<input v-model="message" />
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте компонент с data свойством name и отобразите его в template.',
        solution: '<template>\n    <div>{{ name }}</div>\n</template>\n<script>\nexport default {\n    data() {\n        return { name: "Vue" }\n    }\n}\n</script>',
        hint: 'Используйте двойные фигурные скобки для интерполяции.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое v-model?',
          options: ['Директива', 'Двусторонняя привязка данных', 'Метод', 'Свойство'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 'vue-composition',
    title: 'Composition API',
    category: programmingCategories.FRAMEWORKS,
    language: 'Vue.js',
    level: programmingLevels.ADVANCED,
    duration: 70,
    description: 'Изучите Composition API: setup, ref, reactive, computed и lifecycle hooks.',
    theory: `# Composition API

Composition API — альтернативный способ организации компонентов Vue 3.

## setup

\`\`\`vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
    count.value++;
}
</script>
\`\`\`

## Lifecycle Hooks

\`\`\`vue
<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
    console.log('Компонент смонтирован');
});

onUnmounted(() => {
    console.log('Компонент размонтирован');
});
</script>
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте реактивную переменную message используя ref.',
        solution: 'import { ref } from "vue";\nconst message = ref("Hello");',
        hint: 'Используйте ref() для создания реактивной переменной.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое ref в Composition API?',
          options: ['Ссылка', 'Реактивная переменная', 'Метод', 'Компонент'],
          correct: 1,
        },
      ],
    },
  },

  // Frameworks - Angular
  {
    id: 'angular-basics',
    title: 'Основы Angular',
    category: programmingCategories.FRAMEWORKS,
    language: 'Angular',
    level: programmingLevels.INTERMEDIATE,
    duration: 75,
    description: 'Изучите Angular: компоненты, модули, сервисы и dependency injection.',
    theory: `# Основы Angular

Angular — полнофункциональный фреймворк для создания веб-приложений.

## Компонент

\`\`\`typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-user',
    template: '<h1>{{ name }}</h1>'
})
export class UserComponent {
    name = 'Иван';
}
\`\`\`

## Сервисы

\`\`\`typescript
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    getUser() {
        return { name: 'Иван', age: 25 };
    }
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте компонент с селектором app-hello и свойством message.',
        solution: '@Component({\n    selector: "app-hello",\n    template: "<p>{{ message }}</p>"\n})\nexport class HelloComponent {\n    message = "Hello, Angular!";\n}',
        hint: 'Используйте декоратор @Component.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое dependency injection в Angular?',
          options: ['Паттерн проектирования', 'Метод', 'Компонент', 'Модуль'],
          correct: 0,
        },
      ],
    },
  },

  // Frameworks - Django
  {
    id: 'django-basics',
    title: 'Основы Django',
    category: programmingCategories.FRAMEWORKS,
    language: 'Django',
    level: programmingLevels.INTERMEDIATE,
    duration: 80,
    description: 'Изучите Django: модели, представления, шаблоны и маршрутизация.',
    theory: `# Основы Django

Django — веб-фреймворк для Python.

## Модель

\`\`\`python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
\`\`\`

## Представление

\`\`\`python
from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django!")
\`\`\`

## URL-маршрутизация

\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте модель Article с полями title (CharField) и content (TextField).',
        solution: 'from django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()',
        hint: 'Используйте models.CharField и models.TextField.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое ORM в Django?',
          options: ['Объектно-реляционное отображение', 'Метод', 'Шаблон', 'Модуль'],
          correct: 0,
        },
      ],
    },
  },
  {
    id: 'django-rest',
    title: 'Django REST Framework',
    category: programmingCategories.FRAMEWORKS,
    language: 'Django',
    level: programmingLevels.ADVANCED,
    duration: 70,
    description: 'Изучите Django REST Framework: сериализаторы, ViewSets, аутентификация и API endpoints.',
    theory: `# Django REST Framework

DRF — инструментарий для создания RESTful API в Django.

## Сериализатор

\`\`\`python
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']
\`\`\`

## ViewSet

\`\`\`python
from rest_framework import viewsets

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте сериализатор для модели Article с полями title и content.',
        solution: 'class ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["title", "content"]',
        hint: 'Используйте ModelSerializer.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое ViewSet в DRF?',
          options: ['Представление', 'Набор представлений', 'Модель', 'Сериализатор'],
          correct: 1,
        },
      ],
    },
  },

  // Frameworks - Flask
  {
    id: 'flask-basics',
    title: 'Основы Flask',
    category: programmingCategories.FRAMEWORKS,
    language: 'Flask',
    level: programmingLevels.INTERMEDIATE,
    duration: 50,
    description: 'Изучите Flask: маршруты, шаблоны, формы и работа с базой данных.',
    theory: `# Основы Flask

Flask — легковесный веб-фреймворк для Python.

## Базовое приложение

\`\`\`python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run()
\`\`\`

## Шаблоны

\`\`\`python
from flask import render_template

@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте маршрут /about, который возвращает строку "About page".',
        solution: '@app.route("/about")\ndef about():\n    return "About page"',
        hint: 'Используйте декоратор @app.route.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое декоратор route в Flask?',
          options: ['Функция', 'Маршрутизация URL', 'Шаблон', 'Модуль'],
          correct: 1,
        },
      ],
    },
  },

  // Frameworks - Express.js
  {
    id: 'express-basics',
    title: 'Основы Express.js',
    category: programmingCategories.FRAMEWORKS,
    language: 'Express.js',
    level: programmingLevels.INTERMEDIATE,
    duration: 55,
    description: 'Изучите Express.js: маршруты, middleware, обработка запросов и RESTful API.',
    theory: `# Основы Express.js

Express.js — минималистичный веб-фреймворк для Node.js.

## Базовое приложение

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(3000);
\`\`\`

## Middleware

\`\`\`javascript
app.use(express.json());  // парсинг JSON
app.use(express.static('public'));  // статические файлы
\`\`\`

## Маршруты

\`\`\`javascript
app.get('/users', (req, res) => {
    res.json({ users: [] });
});

app.post('/users', (req, res) => {
    const user = req.body;
    res.status(201).json(user);
});
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте GET маршрут /api/hello, который возвращает JSON {message: "Hello"}.',
        solution: 'app.get("/api/hello", (req, res) => {\n    res.json({ message: "Hello" });\n});',
        hint: 'Используйте res.json() для отправки JSON.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое middleware в Express?',
          options: ['Функция обработки запросов', 'Маршрут', 'Модуль', 'Шаблон'],
          correct: 0,
        },
      ],
    },
  },

  // Frameworks - Next.js
  {
    id: 'nextjs-basics',
    title: 'Основы Next.js',
    category: programmingCategories.FRAMEWORKS,
    language: 'Next.js',
    level: programmingLevels.INTERMEDIATE,
    duration: 60,
    description: 'Изучите Next.js: страницы, серверные компоненты, API routes и оптимизация.',
    theory: `# Основы Next.js

Next.js — React-фреймворк для production с серверным рендерингом.

## Страницы

\`\`\`jsx
// pages/about.js
export default function About() {
    return <h1>О нас</h1>;
}
\`\`\`

## API Routes

\`\`\`jsx
// pages/api/users.js
export default function handler(req, res) {
    res.status(200).json({ users: [] });
}
\`\`\`

## Server Components

\`\`\`jsx
// app/page.js
export default async function Page() {
    const data = await fetch('...');
    return <div>{data}</div>;
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте страницу /contact, которая отображает заголовок "Contact Us".',
        solution: 'export default function Contact() {\n    return <h1>Contact Us</h1>;\n}',
        hint: 'В Next.js каждая страница — это компонент React.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое Server Components в Next.js?',
          options: ['Компоненты на сервере', 'Рендерятся на сервере', 'Оба варианта', 'Клиентские компоненты'],
          correct: 2,
        },
      ],
    },
  },

  // Frameworks - Spring Boot
  {
    id: 'spring-basics',
    title: 'Основы Spring Boot',
    category: programmingCategories.FRAMEWORKS,
    language: 'Spring Boot',
    level: programmingLevels.ADVANCED,
    duration: 75,
    description: 'Изучите Spring Boot: контроллеры, сервисы, dependency injection и REST API.',
    theory: `# Основы Spring Boot

Spring Boot — фреймворк для создания Java-приложений.

## Контроллер

\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
\`\`\`

## Сервис

\`\`\`java
@Service
public class UserService {
    @Autowired
    private UserRepository repository;
    
    public List<User> getAllUsers() {
        return repository.findAll();
    }
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте REST контроллер с GET маршрутом /api/hello.',
        solution: '@RestController\n@RequestMapping("/api")\npublic class HelloController {\n    @GetMapping("/hello")\n    public String hello() {\n        return "Hello";\n    }\n}',
        hint: 'Используйте аннотации @RestController и @GetMapping.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что означает @Autowired в Spring?',
          options: ['Автоматическая инъекция зависимостей', 'Автозагрузка', 'Автоматизация', 'Автозапуск'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - jQuery
  {
    id: 'jquery-basics',
    title: 'Основы jQuery',
    category: programmingCategories.LIBRARIES,
    language: 'jQuery',
    level: programmingLevels.BEGINNER,
    duration: 40,
    description: 'Изучите jQuery: селекторы, манипуляции с DOM, события и AJAX.',
    theory: `# Основы jQuery

jQuery — библиотека для упрощения работы с DOM и AJAX.

## Селекторы

\`\`\`javascript
$('#myId');           // по ID
$('.myClass');        // по классу
$('div');             // по тегу
$('div.myClass');     // комбинация
\`\`\`

## Манипуляции

\`\`\`javascript
$('#element').text('Новый текст');
$('#element').html('<strong>HTML</strong>');
$('#element').addClass('active');
$('#element').hide();
$('#element').show();
\`\`\`

## События

\`\`\`javascript
$('#button').click(function() {
    alert('Кнопка нажата!');
});

$('#form').submit(function(e) {
    e.preventDefault();
    // обработка формы
});
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Используя jQuery, выберите элемент с id="title" и измените его текст на "Hello".',
        solution: '$("#title").text("Hello");',
        hint: 'Используйте метод .text() для изменения текста.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое $ в jQuery?',
          options: ['Переменная', 'Алиас для jQuery', 'Функция', 'Объект'],
          correct: 1,
        },
      ],
    },
  },

  // Libraries - Lodash
  {
    id: 'lodash-basics',
    title: 'Основы Lodash',
    category: programmingCategories.LIBRARIES,
    language: 'Lodash',
    level: programmingLevels.INTERMEDIATE,
    duration: 45,
    description: 'Изучите Lodash: утилиты для работы с массивами, объектами, функциями и коллекциями.',
    theory: `# Основы Lodash

Lodash — библиотека утилит для JavaScript.

## Работа с массивами

\`\`\`javascript
import _ from 'lodash';

_.map([1, 2, 3], n => n * 2);  // [2, 4, 6]
_.filter([1, 2, 3, 4], n => n > 2);  // [3, 4]
_.find([1, 2, 3], n => n > 1);  // 2
\`\`\`

## Работа с объектами

\`\`\`javascript
_.get(obj, 'user.name');  // безопасное получение
_.set(obj, 'user.age', 25);  // установка значения
_.merge(obj1, obj2);  // объединение объектов
\`\`\`

## Утилиты

\`\`\`javascript
_.debounce(func, 300);  // отложенное выполнение
_.throttle(func, 300);  // ограничение частоты
_.cloneDeep(obj);  // глубокое копирование
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Используя Lodash, умножьте каждый элемент массива [1, 2, 3] на 2.',
        solution: 'import _ from "lodash";\nconst result = _.map([1, 2, 3], n => n * 2);',
        hint: 'Используйте метод _.map().',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что делает _.debounce?',
          options: ['Отложенное выполнение', 'Копирование', 'Фильтрация', 'Сортировка'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - Axios
  {
    id: 'axios-basics',
    title: 'Основы Axios',
    category: programmingCategories.LIBRARIES,
    language: 'Axios',
    level: programmingLevels.BEGINNER,
    duration: 35,
    description: 'Изучите Axios: HTTP-запросы, interceptors, обработка ошибок и конфигурация.',
    theory: `# Основы Axios

Axios — библиотека для выполнения HTTP-запросов.

## GET запрос

\`\`\`javascript
import axios from 'axios';

axios.get('/api/users')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
\`\`\`

## POST запрос

\`\`\`javascript
axios.post('/api/users', {
    name: 'Иван',
    email: 'ivan@example.com'
})
.then(response => {
    console.log(response.data);
});
\`\`\`

## Async/Await

\`\`\`javascript
async function fetchUsers() {
    try {
        const response = await axios.get('/api/users');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Сделайте GET запрос к /api/data используя axios и async/await.',
        solution: 'async function fetchData() {\n    const response = await axios.get("/api/data");\n    return response.data;\n}',
        hint: 'Используйте async/await для асинхронных запросов.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое axios?',
          options: ['HTTP клиент', 'Фреймворк', 'Язык', 'База данных'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - Redux
  {
    id: 'redux-basics',
    title: 'Основы Redux',
    category: programmingCategories.LIBRARIES,
    language: 'Redux',
    level: programmingLevels.ADVANCED,
    duration: 70,
    description: 'Изучите Redux: store, actions, reducers, middleware и управление состоянием.',
    theory: `# Основы Redux

Redux — библиотека для управления состоянием приложения.

## Store

\`\`\`javascript
import { createStore } from 'redux';

const store = createStore(reducer);
\`\`\`

## Reducer

\`\`\`javascript
function counterReducer(state = { count: 0 }, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state;
    }
}
\`\`\`

## Actions

\`\`\`javascript
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте action creator для увеличения счетчика.',
        solution: 'const increment = () => ({ type: "INCREMENT" });',
        hint: 'Action creator — это функция, возвращающая action.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое reducer в Redux?',
          options: ['Функция изменения состояния', 'Компонент', 'Метод', 'Объект'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - Bootstrap
  {
    id: 'bootstrap-basics',
    title: 'Основы Bootstrap',
    category: programmingCategories.LIBRARIES,
    language: 'Bootstrap',
    level: programmingLevels.BEGINNER,
    duration: 40,
    description: 'Изучите Bootstrap: сетка, компоненты, утилиты и адаптивный дизайн.',
    theory: `# Основы Bootstrap

Bootstrap — CSS-фреймворк для создания адаптивных интерфейсов.

## Сетка

\`\`\`html
<div class="container">
    <div class="row">
        <div class="col-md-6">Колонка 1</div>
        <div class="col-md-6">Колонка 2</div>
    </div>
</div>
\`\`\`

## Компоненты

\`\`\`html
<button class="btn btn-primary">Кнопка</button>
<div class="alert alert-success">Успех!</div>
<div class="card">
    <div class="card-body">Контент</div>
</div>
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте кнопку с классами Bootstrap: primary цвет и large размер.',
        solution: '<button class="btn btn-primary btn-lg">Кнопка</button>',
        hint: 'Используйте классы btn, btn-primary и btn-lg.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Сколько колонок в сетке Bootstrap?',
          options: ['10', '12', '16', '8'],
          correct: 1,
        },
      ],
    },
  },

  // Libraries - Tailwind CSS
  {
    id: 'tailwind-basics',
    title: 'Основы Tailwind CSS',
    category: programmingCategories.LIBRARIES,
    language: 'Tailwind CSS',
    level: programmingLevels.INTERMEDIATE,
    duration: 50,
    description: 'Изучите Tailwind CSS: utility-first подход, классы, кастомизация и responsive дизайн.',
    theory: `# Основы Tailwind CSS

Tailwind CSS — utility-first CSS-фреймворк.

## Utility классы

\`\`\`html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">
    <h1 class="text-2xl font-bold">Заголовок</h1>
    <button class="px-4 py-2 bg-white text-blue-500 rounded">Кнопка</button>
</div>
\`\`\`

## Responsive

\`\`\`html
<div class="text-sm md:text-base lg:text-lg">
    Адаптивный текст
</div>
\`\`\`

## Кастомизация

\`\`\`javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
            }
        }
    }
}
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте div с flexbox, центрированием элементов и padding 4.',
        solution: '<div class="flex items-center justify-center p-4">Контент</div>',
        hint: 'Используйте классы flex, items-center, justify-center и p-4.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что означает utility-first в Tailwind?',
          options: ['Подход с утилитарными классами', 'Фреймворк', 'Метод', 'Библиотека'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - NumPy
  {
    id: 'numpy-basics',
    title: 'Основы NumPy',
    category: programmingCategories.LIBRARIES,
    language: 'NumPy',
    level: programmingLevels.INTERMEDIATE,
    duration: 55,
    description: 'Изучите NumPy: массивы, операции, индексация и математические функции.',
    theory: `# Основы NumPy

NumPy — библиотека для научных вычислений в Python.

## Создание массивов

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
zeros = np.zeros(5)  # [0, 0, 0, 0, 0]
ones = np.ones(5)    # [1, 1, 1, 1, 1]
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
\`\`\`

## Операции

\`\`\`python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)  # [5, 7, 9]
print(a * 2)  # [2, 4, 6]
print(np.dot(a, b))  # 32 (скалярное произведение)
\`\`\`

## Индексация

\`\`\`python
arr = np.array([1, 2, 3, 4, 5])
print(arr[0])      # 1
print(arr[1:4])    # [2, 3, 4]
print(arr[arr > 3])  # [4, 5]
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте массив NumPy с числами от 0 до 9 и выведите его.',
        solution: 'import numpy as np\narr = np.arange(10)\nprint(arr)',
        hint: 'Используйте np.arange(10).',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое NumPy?',
          options: ['Библиотека для массивов', 'Язык программирования', 'Фреймворк', 'База данных'],
          correct: 0,
        },
      ],
    },
  },

  // Libraries - Pandas
  {
    id: 'pandas-basics',
    title: 'Основы Pandas',
    category: programmingCategories.LIBRARIES,
    language: 'Pandas',
    level: programmingLevels.INTERMEDIATE,
    duration: 60,
    description: 'Изучите Pandas: DataFrame, Series, чтение данных, фильтрация и группировка.',
    theory: `# Основы Pandas

Pandas — библиотека для анализа данных в Python.

## DataFrame

\`\`\`python
import pandas as pd

data = {
    'name': ['Иван', 'Петр', 'Мария'],
    'age': [25, 30, 28],
    'city': ['Москва', 'СПб', 'Казань']
}
df = pd.DataFrame(data)
\`\`\`

## Чтение данных

\`\`\`python
df = pd.read_csv('data.csv')
df = pd.read_excel('data.xlsx')
\`\`\`

## Фильтрация

\`\`\`python
# Фильтр по условию
adults = df[df['age'] > 25]

# Группировка
grouped = df.groupby('city').mean()
\`\`\``,
    exercises: [
      {
        id: 'ex1',
        type: 'code',
        question: 'Создайте DataFrame с колонками name и age, добавьте одну строку данных.',
        solution: 'import pandas as pd\ndf = pd.DataFrame({"name": ["Иван"], "age": [25]})',
        hint: 'Используйте pd.DataFrame() со словарем.',
      },
    ],
    test: {
      questions: [
        {
          id: 'q1',
          question: 'Что такое DataFrame в Pandas?',
          options: ['Таблица данных', 'Массив', 'Список', 'Словарь'],
          correct: 0,
        },
      ],
    },
  },
]

export const getLessonById = (id) => {
  return lessons.find((lesson) => lesson.id === id)
}

export const getLessonsByCategory = (category) => {
  return lessons.filter((lesson) => lesson.category === category)
}

export const getLessonsByLanguage = (language) => {
  return lessons.filter((lesson) => lesson.language === language)
}

export const getLessonsByLevel = (level) => {
  return lessons.filter((lesson) => lesson.level === level)
}

export default {
  programmingCategories,
  programmingLevels,
  lessons,
  getLessonById,
  getLessonsByCategory,
  getLessonsByLanguage,
  getLessonsByLevel,
}
