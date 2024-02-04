var month = new Date().getMonth();
Ext.define('PHNet.view.app.Monthcombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.monthcombo',
    width: 170,
    fieldLabel: '<i class="fas fa-calendar-alt icon_darkblue"></i>',
    labelWidth: 30,
    labelAlign: 'right',
    margin: '2 0 2 5',
    store: Ext.create('PHNet.store.Monthcombo'),
    queryMode: 'local',
    editable: false,
    displayField: 'name',
    valueField: 'id',
    value: month
});