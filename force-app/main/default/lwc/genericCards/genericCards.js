import { LightningElement, api, wire, track} from 'lwc';
import getsObjectList from '@salesforce/apex/reusableCardsController.getsObjectList';
 
export default class GenericCards extends LightningElement {
 
    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @track act_data;
 
    @wire (getsObjectList, {sobj : '$sObject', Fields : '$Fields'}) ObjectList({data,error}){
        if(data){
            console.log('0');
            console.log(JSON.stringify(data.length));
            console.log(data);
            this.act_data = data;
        }
 
     }

    }