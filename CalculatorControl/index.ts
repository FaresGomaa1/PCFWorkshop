import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CalculatorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private messageDiv: HTMLDivElement;
    private input: HTMLInputElement;
    private myNotifyOutputChanged: () => void;
    private calculatedResult = ""; 

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.myNotifyOutputChanged = notifyOutputChanged;

        this.messageDiv = document.createElement("div");
        this.input = document.createElement("input");

        this.input.addEventListener("blur", () => {
            this.calculate();
        });

        this.messageDiv.appendChild(this.input);
        container.appendChild(this.messageDiv);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.input.value = context.parameters.sampleProperty.raw || "";
    }

private calculate(): void {
    const inputValue = this.input.value.trim();

    // Check if it's just a single number
    if (/^\d+$/.test(inputValue)) {
        this.calculatedResult = inputValue;
        this.myNotifyOutputChanged();
        return;
    }

    // Check for a full expression: number operator number
    const match = inputValue.match(/^(\d+)\s*([+\-*/])\s*(\d+)$/);
    if (match) {
        const firstDigit = Number(match[1]);
        const operator = match[2];
        const secondDigit = Number(match[3]);

        let result: number;
        switch (operator) {
            case '+':
                result = firstDigit + secondDigit;
                break;
            case '-':
                result = firstDigit - secondDigit;
                break;
            case '*':
                result = firstDigit * secondDigit;
                break;
            case '/':
                result = secondDigit !== 0 ? firstDigit / secondDigit : NaN;
                break;
            default:
                result = NaN;
        }

        this.calculatedResult = isNaN(result) ? "Wrong Inputs" : result.toString();
        this.myNotifyOutputChanged();
        return;
    }

    // If neither a number nor a valid expression
    this.calculatedResult = "Wrong Inputs";
    this.myNotifyOutputChanged();
}


    public getOutputs(): IOutputs {
        return {
            sampleProperty: this.calculatedResult
        };
    }

    public destroy(): void {
        // Cleanup if needed
    }
}
