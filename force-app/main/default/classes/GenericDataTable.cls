public with sharing class GenericDataTable {

    @AuraEnabled(cacheable=true)
    Public static QueryDetails getFieldsList(String sobj, String Fields, String OrdBy, String sortorder, Integer LIM, Integer offset) {

        system.debug('OrdBy------>>>>>>' + OrdBy);

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
    
    if(OrdBy != null && sortorder != null){
        Query = Query + ' ORDER BY ' + OrdBy + ' ' + sortorder;
    }

    Query += ' LIMIT ' + LIM + ' offset ' + offset;

    system.debug('Query------>>>>>' + Query);

    String CountQuery = 'Select count(Id) RecCount From ' + sobj;

    List<sObject> sObjectCount = Database.query(CountQuery);

            Integer sCount;

        for(sObject so : sObjectCount){
            sCount = (Integer) so.get('RecCount');
        }

    List<sObject> sObjectList = Database.query(Query);

    QueryDetails QD = new QueryDetails(FLS,FTS,sObjectList,sCount);
        
        return QD;
    }


    Public class QueryDetails {
        @AuraEnabled
        public List<String> FieldLabels {get;set;}
        @AuraEnabled
        Public List<String> FieldTypes {get;set;}
        @AuraEnabled
        Public List<sObject> FieldValueSobjectList {get;set;}
        @AuraEnabled 
        Public Integer RecordCount {get;set;}

        Public QueryDetails(List<String> Lbls, List<String> Types, List<sObject> FieldValLst, Integer RecCount){
            this.FieldLabels = Lbls;
            this.FieldTypes = Types;
            this.FieldValueSobjectList = FieldValLst;
            this.RecordCount = RecCount;
        }

    }

}