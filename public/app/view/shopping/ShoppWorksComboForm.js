Ext.define('PHNet.view.shopping.ShoppWorksComboForm', {
    extend: 'Ext.form.field.ComboBox',
    alias : 'widget.shoppworkscomboform',
    id: 'shoppworkscomboform',
    store: Ext.create('PHNet.store.shopping.Workscomboform'),
    allowBlank: true,
    editable: false,
    margin: '2 0 2 5',
    width: 220,
    fieldLabel: '<i class="fas fa-hotel icon_darkblue"></i>',
    labelWidth: 30,
    labelAlign: 'right',
    displayField: 'name',
    valueField: 'id'
});	