Ext.define('PHNet.store.Monthcombo', {
    extend: 'Ext.data.Store',
    fields: ['id', 'name'],
    data : [
        {"id":"-1", "name":"Todos los Meses"},
        {"id":"01", "name":"Enero"},
        {"id":"02", "name":"Febrero"},
        {"id":"03", "name":"Marzo"},
        {"id":"04", "name":"Abril"},
        {"id":"05", "name":"Mayo"},
        {"id":"06", "name":"Junio"},
        {"id":"07", "name":"Julio"},
        {"id":"08", "name":"Agosto"},
        {"id":"09", "name":"Septiembre"},
        {"id":"10", "name":"Octubre"},
        {"id":"11", "name":"Noviembre"},
        {"id":"12", "name":"Diciembre"},
    ]
});