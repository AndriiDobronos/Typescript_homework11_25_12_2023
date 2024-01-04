//Ми розробляємо систему управління розумним будинком.
//
// Ми можемо керувати світлом, системою кондиціонування та безпеки через
// контрольну панель, що знаходиться у будинку.
//
// Light, AirConditioner та SecuritySystem не можна змінювати, це девайси
// різних фірм, які надають деяке публічне апі для керування, яке можна
// використовувати, щоб інтегрувати з нашою системою, та ми не можемо змінювати
// їх реалізацію або поведінку!
//
// Наш клас HomeControlPanel має методи leaveHome та backHome та toggleDevice.
// За допомогою leaveHome ми вимикаємо всі девайси та вмикаємо систему безпеки
//
// За допомогою backHome вмикаємо всі девайси та вимикаємо систему безпеки.
//
// toggleDevice вмикає або вимикає девайс в залежності від його стану.
//
// Пізніше ми додали новий метод контролю за розумним будинком - через
// дистанційний пульт RemoteControl. Він не має доступу до управління системою
// безпеки, але вміє керувати світлом та кондиціонером.
//
// Ваша задача відрефакторити існуючий код (окрім Light, AirConditioner та
// SecuritySystem) використовуючи деякі патерн(и) які ми з вами розглянули на лекції.
// Постарайтеся позбутися дублювання коду у класах та уніфікувати публічне апі девайсів.
//
// P.S: Не потрібно витрачати час на розбоку UI або модифікувати поведінку.
// Приділіть більше уваги структуризації.

enum EDeviceType {
    Light = "light",
    AirConditioner = "air-conditioner",
    SecuritySystem = "security-system",
}

class Light {
    // НЕ ЗМІНЮЙТЕ ЦЕЙ  КЛАС

    type = EDeviceType.Light;
    #isTurnedOn = false;

    get isTurnedOn(): boolean {
        return this.#isTurnedOn;
    }

    turnOn() {
        this.#isTurnedOn = true;
        console.log("Light is ON");
    }

    turnOff() {
        this.#isTurnedOn = false;
        console.log("Light is OFF");

    }

}


class AirConditioner {
    // НЕ ЗМІНЮЙТЕ ЦЕЙ  КЛАС
    type = EDeviceType.AirConditioner;
    #isWorking = false;

    get isWorking(): boolean {
        return this.#isWorking;
    }

    start() {
        this.#isWorking = true;
        console.log("Air Conditioner is ON");
    }

    stop() {
        this.#isWorking = false;
        console.log("Air Conditioner is OFF");
    }
}

class SecuritySystem {
    // НЕ ЗМІНЮЙТЕ ЦЕЙ  КЛАС

    type = EDeviceType.SecuritySystem;
    #isWatching = false;

    get isWatching(): boolean {
        return this.#isWatching;
    }

    enable() {
        this.#isWatching = true;
        console.log("Security system is ON");
    }

    disable() {
        this.#isWatching = false;
        console.log("Security system is OFF");
    }
}

class HomeControlPanel {
    #light: Light;
    #airConditioner: AirConditioner;
    #securitySystem: SecuritySystem;

    constructor(
        light: Light,
        airConditioner: AirConditioner,
        securitySystem: SecuritySystem

    ) {
        this.#light = light;
        this.#securitySystem = securitySystem;
        this.#airConditioner = airConditioner;
    }

    toggleDevice(type: EDeviceType) {
        // Some additional business logic.....

        if (type === EDeviceType.Light) {
            if (this.#light.isTurnedOn) {
                this.#light.turnOff();
            } else {
                this.#light.turnOff();
            }
        } else if (type === EDeviceType.AirConditioner) {
            if (this.#airConditioner.isWorking) {
                this.#airConditioner.stop();
            } else {
                this.#airConditioner.start();
            }

        } else if (type === EDeviceType.SecuritySystem) {
            if (this.#securitySystem.isWatching) {
                this.#securitySystem.disable();
            } else {
                this.#securitySystem.enable();
            }
        }
    }

    leaveHome(): void {
        // Some additional business logic.....

        this.#airConditioner.stop();
        this.#light.turnOff();
        this.#securitySystem.enable();
    }

    backHome(): void {
        // Some additional business logic.....

        this.#airConditioner.start();
        this.#light.turnOn();
        this.#securitySystem.disable();
    }
}

class RemoteControl {
    #light: Light;
    #airConditioner: AirConditioner;

    constructor(light: Light, airConditioner: AirConditioner) {
        this.#light = light;
        this.#airConditioner = airConditioner;
    }

    toggleLight(): void {
        // Some additional business logic.....

        if (this.#light.isTurnedOn) {
            this.#light.turnOff();
        } else {
            this.#light.turnOn();
        }
    }

    toggleAirCondition(): void {
        // Some additional business logic.....
        if (this.#airConditioner.isWorking) {
            this.#airConditioner.stop();
        } else {
            this.#airConditioner.start();
        }
    }
}
//**************************************************************************//
// З використання патерна "Bridge"

// Реалізація для різних типів пристроїв
interface IDevice {
    toggleDevice(): void;
    getDeviceStatus(): boolean;
}

// Реалізація конкретного пристрою
class SpecificDevice implements IDevice {
    private isOn: boolean = false;

    toggleDevice(): void {
        this.isOn = !this.isOn;
    }

    getDeviceStatus(): boolean {
        return this.isOn;
    }
}

// Абстракція для контролерів пристроїв
abstract class HomeAndRemoteControl {
    protected device: IDevice;

    protected constructor(device: IDevice) {
        this.device = device;
    }

    abstract toggle(): void;
}

// Реалізація контролеру світла
class LightRemoteControl extends HomeAndRemoteControl {
    constructor(device: IDevice) {
        super(device);
    }

    toggle(): void {
        this.device.toggleDevice();
    }
}

// Реалізація контролеру кондиціонера
class AirConditionerRemoteControl extends HomeAndRemoteControl {
    constructor(device: IDevice) {
        super(device);
    }

    toggle(): void {
        this.device.toggleDevice();
    }
}

// Реалізація охоронної системи
class SecuritySystemHomeControlPanel extends HomeAndRemoteControl {
    constructor(device: IDevice) {
        super(device);
    }

    toggle(): void {
        this.device.toggleDevice();
    }
}

// Використання
const lightDevice = new SpecificDevice();
const lightRemoteControl = new LightRemoteControl(lightDevice);

lightRemoteControl.toggle(); // Toggle the light
const lightStatus = lightDevice.getDeviceStatus(); // Get light status

const acDevice = new SpecificDevice();
const acRemoteControl = new AirConditionerRemoteControl(acDevice);

acRemoteControl.toggle(); // Toggle the air conditioner
const acStatus = acDevice.getDeviceStatus(); // Get air conditioner status

const securitySystem = new SpecificDevice();
const securitySystemHomeControlPanel = new SecuritySystemHomeControlPanel(securitySystem);

securitySystemHomeControlPanel.toggle(); // Toggle the securitySystem
const securitySystemStatus = acDevice.getDeviceStatus(); // Get securitySystem status