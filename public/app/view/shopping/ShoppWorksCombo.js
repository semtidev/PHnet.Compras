Ext.define('PHNet.view.shopping.ShoppWorksCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.shoppworkscombo',
    id: 'shoppworkscombo',
    store: Ext.create('PHNet.store.shopping.Workscombo'),
    allowBlank: true,
    editable: false,
    margin: '2 0 2 0',
    width: 220,
    fieldLabel: '<i class="fas fa-hotel icon_darkblue"></i>',
    labelWidth: 30,
    labelAlign: 'right',
    displayField: 'name',
    valueField: 'id',
    value: -1
});