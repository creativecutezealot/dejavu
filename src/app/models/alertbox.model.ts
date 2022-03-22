export class Alertbox {
    public title: string;
    public message: string;
    public subtitle: string;
    public status: boolean;
    public hasEvent: string;
    public hasField: boolean = false;
    public hideCloseButton: Boolean = false;
    public messageClass = "";
    public button_ok: string = "OK";
    public type: string = "";

    public hasButton: boolean;
    public buttonLabel: string;
    public fieldValue: string = "";
    public fieldType: string = "text";//number
    public fieldPlaceholder: string = "";
    public err_msg = "";
    public bets = [];
    public game_table: string = "";
}