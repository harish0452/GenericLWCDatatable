public with sharing class reusableCardsController {
 
@AuraEnabled(cacheable=true)
public static List<sObject> getsObjectList(String sobj, List<String> Fields){
String FieldsString = '';
for(String s : Fields){
FieldsString = FieldsString + s;
}
String Query = 'Select ' + FieldsString + ' From ' + sobj + ' LIMIT 10';
 
List<sObject> sObjectList = Database.query(Query);
system.debug('sObjectList----->>>>>' +sObjectList);
return sObjectList;
}
}