public with sharing class AccountsForWebComponent {

    @AuraEnabled(cacheable=true)
    Public static QueryDetails getFieldsList(String sobj, String Fields, String LIM) {

        String ObjType = sobj;
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(ObjType);
        Map<String, Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap();

        List<String> StringList = Fields.split(',');

        List<String> FLs = new List<String>();
        List<String> FTs = new List<String>();

        for(String s : StringList) {
        FLs.add(fieldMap.get(s).getDescribe().getLabel());
        FTs.add(String.Valueof(fieldMap.get(s).getDescribe().getType()).toLowercase());
        }

        String Query = 'Select ' + Fields + ' From ' + sobj;
    
        if(LIM != '' ){
            Query = Query + ' LIMIT ' + LIM;
        }
    
    List<sObject> sObjectList = Database.query(Query);

    QueryDetails QD = new QueryDetails(FLS,FTS,sObjectList);
        return QD;
    }

    Public class QueryDetails {
        @AuraEnabled
        public List<String> FieldLabels {get;set;}
        @AuraEnabled
        Public List<String> FieldTypes {get;set;}
        @AuraEnabled
        Public List<sObject> FieldValueSobjectList {get;set;}

        Public QueryDetails(List<String> Lbls, List<String> Types, List<sObject> FieldValLst){
            this.FieldLabels = Lbls;
            this.FieldTypes = Types;
            this.FieldValueSobjectList = FieldValLst;
        }

    }

}
