import { LightningElement, api, wire, track } from 'lwc';

import getFieldsList from '@salesforce/apex/AccountsForWebComponent.getFieldsList';
import getsObjectWithOffset from '@salesforce/apex/AccountsForWebComponent.getsObjectWithOffset';

const my_columns = [];

export default class DynaTable extends LightningElement {

    @track sortBy;
    @track sortDirection;

    @track columns;
    @track ComboBoxOptions = [10,50,100];
    @api showDetails = false;
    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @api LIMIT = this.LIMIT;
    @track act_data;
    @api OrderBy;

    @track paginationRange = [];
    @track totalRecords;

    @track value = '10';
    @track offset = '0';
    @track PageNumber = '1';
    @track isLoaded = false;

    @track ready = false;

    get options() {
        return [
            { label: '10', value: '10' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    handleNext(event) {

        this.offset = parseInt(this.offset) + parseInt(this.value);
        this.PageNumber = parseInt(this.PageNumber) + 1;
        this.isLoaded = false;
        
}

    handlePrevious(event){
        if(parseInt(this.offset) !== 0){
        this.offset = parseInt(this.offset) - parseInt(this.value);
        this.isLoaded = false;
        }
        this.PageNumber = parseInt(this.PageNumber) - 1;
        
        if(parseInt(this.PageNumber) === 0){
            this.offset = 0;
            this.PageNumber = 1;
        }
    }


    getSelectedName() {
        console.log('Row Selected');
    }

    @wire (getsObjectWithOffset, {sobj : '$sObject', Fields : '$Fields', OrdBy : '$OrderBy', LIM: '$value', offset : '$offset'}) sObjectWithOffset({data,error}){
        if(data){
            console.log(data);
            
        }
        if(error){

        }
    }


    @wire (getFieldsList, {sobj : '$sObject', Fields : '$Fields', OrdBy : '$OrderBy', LIM : '$value', offset : '$offset'}) FieldsList({data,error}){
        
        if(data){

            var Fields = this.Fields;
            var arr = Fields.split(",");
            var FieldLabels = data.FieldLabels;
            var FieldTypes = data.FieldTypes;

            this.totalRecords = data.RecordCount;

            console.log('this.totalRecords------' + this.totalRecords);

            this.act_data = data.FieldValueSobjectList;  
            console.log('isLoaded------>>>>>' + this.isLoaded);
            this.isLoaded = true;
            console.log('isLoaded--After---->>>>>' + this.isLoaded);
            

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

    handleRowActions() {



    }

    

constructor(){
    super();
    if(this.LIMIT === undefined){
        this.LIMIT = "";
    }
}

 
   

}