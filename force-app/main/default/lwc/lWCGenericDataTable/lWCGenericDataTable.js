import { LightningElement, api, wire, track } from 'lwc';

import getFieldsList from '@salesforce/apex/GenericDataTable.getFieldsList';

const my_columns = [];
const sortLabels = [];

export default class DynaTable extends LightningElement {

    @track sortBy;
    @track sortDirection = 'asc';

    @track columns;
    @track sortingLabels;


    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @api LIMIT = this.LIMIT;
    @track act_data;
    @api OrderBy;

    @track totalRecords;
    @track TotalPageNumbers;

    @track StartingRecord = '1';
    @track EndingRecord = '10';



    @track value = '10';
    @track offset = 0;
    @track PageNumber = 1;
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
        this.offset = 0;
        this.StartingRecord = '1';
        this.PageNumber = 1;
        this.EndingRecord = this.value;
    }

    handlesort(event) {
        this.sortBy = event.detail.value;
        this.OrderBy = event.detail.value;


    }

    handleNext(event) {

        this.offset = parseInt(this.offset) + parseInt(this.value);
        this.PageNumber = parseInt(this.PageNumber) + 1;
        this.StartingRecord = parseInt(this.StartingRecord) + parseInt(this.value);
        this.EndingRecord = parseInt(this.EndingRecord) + parseInt(this.value);
        this.isLoaded = false;
        
}

    handlePrevious(event){
        if(parseInt(this.offset) !== 0){
        this.offset = parseInt(this.offset) - parseInt(this.value);
        this.StartingRecord = parseInt(this.StartingRecord) - parseInt(this.value);
        this.EndingRecord = parseInt(this.EndingRecord) - parseInt(this.value);
        this.isLoaded = false;
        }
        this.PageNumber = parseInt(this.PageNumber) - 1;
        
        if(parseInt(this.PageNumber) === 0){
            this.offset = 0;
            this.PageNumber = 1;
        }
    }


    getSelectedName() {
        //
    }

    @wire (getFieldsList, {sobj : '$sObject', Fields : '$Fields', OrdBy : '$OrderBy',sortorder : '$sortDirection', LIM : '$value', offset : '$offset'}) FieldsList({data,error}){
        
        if(data){

            var Fields = this.Fields;
            var arr = Fields.split(",");
            var FieldLabels = data.FieldLabels;
            var FieldTypes = data.FieldTypes;

            this.totalRecords = data.RecordCount;
            this.TotalPageNumbers = Math.ceil(parseInt(this.totalRecords)/parseInt(this.value));
            
            this.act_data = data.FieldValueSobjectList;  
            this.isLoaded = true;

            for(let i=0;i<FieldLabels.length;i++){
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: true};
                    my_columns.push(lab);
            }

            this.columns = my_columns;

            for(let i=0;i<FieldLabels.length;i++){
                let lab = {label : FieldLabels[i], value : arr[i]}
                sortLabels.push(lab);                
            }
            this.sortingLabels = sortLabels;

        }
        if(error){
            console.log(error);
        }

    }

    handleSortdata(event){

        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.OrdBy = this.sortBy;
        this.OrderBy = this.sortBy;

    }

    handleRowActions() {
        //
    }

    

constructor(){
    super();
    if(this.LIMIT === undefined){
        this.LIMIT = "";
    }
}

 
   

}