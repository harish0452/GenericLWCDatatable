import { LightningElement, api, wire, track } from 'lwc';

import getFieldsList from '@salesforce/apex/GenericDataTable.getFieldsList';
import getDomainName from '@salesforce/apex/GenericDataTable.getDomainName';

const my_columns = [];
const sortLabels = [];

const actions = [
    { label: 'Show details', name: 'show_detailsNewTab' },
    ];

export default class DynaTable extends LightningElement {

    @track sortBy;
    @track sortDirection = 'asc';

    @track columns;
    @track sortingLabels;
    @api EnableSorting;
    @api EnableFlow=false;


    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @api LIMIT = this.LIMIT;
    @track act_data;
    @api OrderBy;
    @api FlowName;

    @track totalRecords;
    @track TotalPageNumbers;

    @track StartingRecord = '1';
    @track EndingRecord = '10';



    @track value = '10';
    @track offset = 0;
    @track PageNumber = 1;
    @track isLoaded = false;

    @track ready = false;
    @track myurl;

    @track DisablePrevious = true;
    @track DisableFirst = true;
    @track DisabledLast;

    @track openmodel = false;
    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

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
        console.log('Ending Record from handle change------' + this.EndingRecord);
        console.log('Total records------->>>>' + this.totalRecords);
        if(this.EndingRecord >= this.totalRecords){
            this.EndingRecord = this.totalRecords;
            this.DisableNext = true;
            this.DisabledLast = true;
        }
        if(this.EndingRecord <= this.totalRecords){
           // this.DisableNext = false;
        }
    }

    handlesort(event) {
        this.sortBy = event.detail.value;
        this.OrderBy = event.detail.value;


    }

    handleNext(event) {
        this.DisablePrevious = false;
        this.offset = parseInt(this.offset) + parseInt(this.value);
        this.PageNumber = parseInt(this.PageNumber) + 1;
        this.StartingRecord = parseInt(this.StartingRecord) + parseInt(this.value);
        this.EndingRecord = parseInt(this.EndingRecord) + parseInt(this.value);
        if(this.totalRecords <= this.EndingRecord){
            this.EndingRecord = this.totalRecords;
            this.DisableNext = true;
        }
        if(this.totalRecords <= this.StartingRecord){
            this.StartingRecord = this.totalRecords;
        }
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
        if(parseInt(this.PageNumber) === 1){
            this.DisablePrevious = true;
        }
        if(this.totalRecords >= this.EndingRecord){
            this.DisableNext = false;
        }
    }


    getSelectedName() {
        //
    }

    @wire (getDomainName) domainName;

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

            let actionsColumn = { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } };
            my_columns.push(actionsColumn);

            for(let i=0;i<FieldLabels.length;i++){

                if(this.EnableSorting===true){
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: true, editable: 'true'};
                    my_columns.push(lab);
                } else if(this.EnableSorting===false){
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: false, editable: 'true'};
                   my_columns.push(lab);

                }
                }

                if(this.EnableFlow===true){
                let labFlow = {type: 'button', label: 'Open Flow', typeAttributes: {
                    label: 'view Details',
                    menuAlignment: 'right',
                    title: 'View Details',
                    name: 'viewDetails',
                    value: 'viewDetails',
                    variant: 'brand'
                }};
                my_columns.push(labFlow);
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

    LaunchFlow(event) {

        const action = event.detail.action;
        console.log('action New------>>>>>' + action);

        let row = event.detail.row;
        let currenRecordId= row.Id;
        let my_domain = this.domainName.data;

        switch (action.name) {

            case 'show_detailsNewTab':
                this.myurl = my_domain + '/' + currenRecordId;
                window.open(this.myurl);
                break;

            case 'show_detailsModal':
                this.myurl = my_domain + '/' + currenRecordId;
                this.openmodal();
                break;

            case 'delete':
                const rows = this.data;
                const rowIndex = rows.indexOf(row);
                rows.splice(rowIndex, 1);
                this.data = rows;
                break;

            case 'viewDetails':
            let Flow_Name=this.FlowName;
            this.myurl = my_domain + '/flow/' + Flow_Name + '?recordId=' + currenRecordId;
            this.openmodal();

 }


 

 
    }

    

constructor(){
    super();
    if(this.LIMIT === undefined){
        this.LIMIT = "";
    }
}

 
   

}