export class PopupoverSelect{
    public key:string;
    public value:string;
    public is_separator:boolean
    public itemObject:any;

    constructor(key?:string,value?:string,is_separator?:boolean,itemObject?:any){
        this.key = key;
        this.value = value;
        this.is_separator = is_separator;
        this.itemObject = itemObject;
    }
}