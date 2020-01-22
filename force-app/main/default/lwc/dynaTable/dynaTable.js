import { LightningElement, api, wire, track } from 'lwc';

import getFieldsList from '@salesforce/apex/AccountsForWebComponent.getFieldsList';

const my_columns = [];

export default class DynaTable extends LightningElement {

    @track sortBy;
    @track sortDirection;

    @track columns;
    @api showDetails = false;
    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @api LIMIT = this.LIMIT;

    @track act_data;

    @wire (getFieldsList, {sobj : '$sObject', Fields : '$Fields', LIM : '$LIMIT'}) FieldsList({data,error}){
        if(data){
            var Fields = this.Fields;
            var arr = Fields.split(",");
            var FieldLabels = data.FieldLabels;
            var FieldTypes = data.FieldTypes;

            this.act_data = data.FieldValueSobjectList;

            for(let i=0;i<FieldLabels.length;i++){
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: true};
                    my_columns.push(lab);
            }

            this.columns = my_columns;

        }
        if(error){
            console.log(error);
        }

    }

    handleSortdata(event){

        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);

    }

    sortData(fieldname, direction) {
    
        let parseData = JSON.parse(JSON.stringify(this.act_data));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            return isReverse * ((x > y) - (y > x));
        });

        this.act_data = parseData;

    }

    

constructor(){
    super();
    if(this.LIMIT === undefined){
        this.LIMIT = "";
    }
}

 
   

}