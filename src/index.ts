//Вам необхідно написати додаток Todo list. У списку нотаток повинні бути методи
// для додавання нового запису, видалення, редагування та отримання повної
// інформації про нотатку за ідентифікатором, а так само отримання списку
// всіх нотаток. Крім цього, у користувача має бути можливість позначити нотатку,
// як виконану, і отримання інформації про те, скільки всього нотаток у списку
// і скільки залишилося невиконаними. Нотатки не повинні бути порожніми.

// Кожний нотаток має назву, зміст, дату створення (або редагування) та статус.
// Нотатки бувають двох типів. Дефолтні та такі, які вимагають підтвердження при редагуванні.

// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка
// за ім'ям або змістом.

// Також окремо необхідно розширити список можливістю сортування нотаток за статусом
// або часом створення.

interface INote {
    id: number;
    creationDate: Date;
    title: string;
    content: string;
    setEdit(newTitle: string,newContent: string): void
}

class Note implements INote {
    readonly id: number;
    title: string;
    content: string;
    readonly creationDate: Date;
    private _lastModifiedDate: Date;
    private _confirmedEdit: boolean;
    private _completed: boolean;

    constructor(id: number, title: string, content: string, confirmedEdit: boolean = false) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.creationDate = new Date();
        this._lastModifiedDate = new Date();
        this._confirmedEdit = confirmedEdit;
        this._completed = false;
    }

    get id(): number {
        return this.id;
    }

    get title(): string {
        return this.title;
    }

    // set title(newTitle: string) {
    //     if (!this._confirmedEdit) {
    //         this._title = newTitle;
    //         this._lastModifiedDate = new Date();
    //     } else {
    //         console.log("This note requires confirmation before editing the title.");
    //     }
    // }

    get content(): string {
        return this.content;
    }

    setEdit(newTitle: string,newContent: string):void {
        if (!this._confirmedEdit) {
            this.title = newTitle;
            this.content = newContent;
            this._lastModifiedDate = new Date();
        } else {
            console.log("This note requires confirmation before editing the title.");
        }
    }

    // set content(newContent: string) {
    //     if (!this._confirmedEdit) {
    //         this._content = newContent;
    //         this._lastModifiedDate = new Date();
    //     } else {
    //         console.log("This note requires confirmation before editing the content.");
    //     }
    // }

    get creationDate(): Date {
        return this.creationDate;
    }

    get lastModifiedDate(): Date {
        return this._lastModifiedDate;
    }

    get confirmedEdit(): boolean {
        return this._confirmedEdit;
    }

    set confirmedEdit(value: boolean) {
        this._confirmedEdit = value;
    }

    get completed(): boolean {
        return this._completed;
    }

    set completed(value: boolean) {
        this._completed = value;
    }
}

interface ITodoList {
    notes: Note[];
    addNote(note: Note): void;
    deleteNoteById(id: number): void;
    editNoteById(id: number, newTitle: string, newContent: string): void;
    getNoteById(id: number): Note | undefined;
    getAllNotes(): Note[];
    getNumberOfNotes(): number;
    getNumberOfIncompleteNotes(): number;
    autoDeleteEmptyNotes (): Note[];
}

class TodoList implements ITodoList {
    notes: Note[];

    constructor() {
        this.notes = [];
    }

    addNote(note: Note): void {
        this.notes.push(note);
    }

    deleteNoteById(id: number): void {
        this.notes = this.notes.filter((note) => note.id !== id);
    }

    editNoteById(id: number, newTitle: string, newContent: string): void {
        const noteToEdit = this.notes.find((note) => note.id === id);
        if (noteToEdit) {
            noteToEdit.title = newTitle;
            noteToEdit.content = newContent;
        }
    }

    getNoteById(id: number): Note | undefined {
        return this.notes.find((note) => note.id === id);
    }

    getAllNotes(): Note[] {
        return this.notes;
    }

    getNumberOfNotes(): number {
        return this.notes.length;
    }

    getNumberOfIncompleteNotes(): number {
        return this.notes.filter((note) => !note.completed).length;
    }

    autoDeleteEmptyNotes (): Note[] {
        return this.notes.filter(
            (note) =>
                note.content.length !== 0 &&
                note.title.length !== 0
        );
    }
}

interface ITodoListWithSearchNotes {
    notes: Note[];
    searchNotesByTitleOrContent(keyword: string): Note[];
}

class TodoListWithSearchNotes extends TodoList implements ITodoListWithSearchNotes {
    notes: Note[];

    searchNotesByTitleOrContent(keyword: string): Note[] {
        return this.notes.filter(
            (note) =>
                note.title.toLowerCase().includes(keyword.toLowerCase()) ||
                note.content.toLowerCase().includes(keyword.toLowerCase())
        );
    }
}

interface ITodoListWithSortNotesAndWithSearchNotes {
    notes: Note[];
    sortNotesByStatus(): void;
    sortNotesByCreationDate(): void;
}

class TodoListWithSortNotesAndWithSearchNotes extends TodoListWithSearchNotes implements ITodoListWithSortNotesAndWithSearchNotes {
    notes: Note[];

    sortNotesByStatus(): void {
        this.notes.sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    sortNotesByCreationDate(): void {
        this.notes.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime());
    }
}
