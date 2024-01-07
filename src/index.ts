//У нас є проста система керування задачами. Треба використовуючи патерн Спостерігач
// модифікувати код таким чином, щоб клас юзер міг реагувати на додавання нової задачі
// на дошку. Якщо assigneeId та user id збігаються, то клас user має установлювати
// задачу у #activeTask.
//
// * Додаткове завдання: Використовуючи патерн стратегія, розширити логіку,
// додавши кілька різних провайдерів нотифікацій: емейл, телеграм, смс.
// Вибраний Провайдер також повинен реагувати на додавання задачі на дошку
// та виводити інформацію про задачу та провайдер.
// Наприклад: "EMAIL: task MyTask added to board"

interface Observer {
    update(task: Task): void;
}

interface NotificationStrategy {
    notify(taskName: string): void;
}

class EmailNotification implements NotificationStrategy {
    notify(taskName: string): void {
        console.log(`EMAIL: task ${taskName} added to board`);
    }
}

class TelegramNotification implements NotificationStrategy {
    notify(taskName: string): void {
        console.log(`TELEGRAM: task ${taskName} added to board`);
    }
}

class SMSNotification implements NotificationStrategy {
    notify(taskName: string): void {
        console.log(`SMS: task ${taskName} added to board`);
    }
}

class Task {
    constructor(
        public title: string,
        public description: string,
        public assigneeId: string
    ) {}
}

class TaskBoard {
    #tasks: Task[] = [];
    #observers: Observer[] = [];
    #notificationStrategy: NotificationStrategy;

    constructor(notificationStrategy: NotificationStrategy) {
        this.#notificationStrategy = notificationStrategy;
    }

    get tasks() {
        return this.#tasks;
    }

    addTask(task: Task,taskName:string): void {
        this.#tasks.push(task);
        this.notifyStrategy(taskName);
    }

    addObserver(observer: Observer): void {
        this.#observers.push(observer);
    }

    private notifyObservers(task: Task): void {
        this.#observers.forEach(observer => {
            observer.update(task);
        });
    }

    private notifyStrategy(taskName: string): void {
        this.#notificationStrategy.notify(taskName);
    }
}

class User implements Observer {
    #activeTask?: Task;
    name: string;
    readonly id: string;

    constructor(name: string) {
        this.name = name;
        this.id = "id" + Math.random().toString(16).slice(2);
    }

    get activeTask(): Task | undefined {
        return this.#activeTask;
    }

    update(task: Task): void {
        if (task.assigneeId === this.id) {
            this.#activeTask = task;
            console.log(`Користувач ${this.name} отримав нову задачу: ${task.title}`);
            console.log(`Активна задача користувача ${this.name}: ${task.title}`);
        }
    }
}

// Використання
const emailNotifier = new EmailNotification();
const telegramNotifier = new TelegramNotification();
const smsNotifier = new SMSNotification();

const taskBoardWithEmail = new TaskBoard(emailNotifier);
const taskBoardWithTelegram = new TaskBoard(telegramNotifier);
const taskBoardWithSMS = new TaskBoard(smsNotifier);

taskBoardWithEmail.addTask("Send an email");
taskBoardWithTelegram.addTask("Send a telegram");
taskBoardWithSMS.addTask("Send SMS");

const user1 = new User("User 1");
const user2 = new User("User 2");

const taskBoard = new TaskBoard(new EmailNotification());

taskBoard.addObserver(user1);
taskBoard.addObserver(user2);

const task1 = new Task("Task 1", "Description 1", user1.id);
const task2 = new Task("Task 2", "Description 2", user2.id);

taskBoard.addTask(task1,"task1");
taskBoard.addTask(task2,"task2");