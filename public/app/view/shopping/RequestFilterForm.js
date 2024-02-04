Ext.define('PHNet.view.shopping.RequestFilterForm', {
    extend: 'Ext.window.Window',
    id: 'requestfilterform',
    alias : 'widget.requestfilterform',
    requires: ['Ext.form.*'],
    title: '<i class="fas fa-filter fa-sm"></i>&nbsp;&nbsp;Filtros Avanzados',
    layout: 'fit',
	animateTarget: 'request-filterbtn',
    autoShow: true,
    resizable: false,
    width: 650,
    height: 340,
    modal: true,
	initComponent: function() {
        
        // Let dates document
        let datedoc  = new Date();
        datedoc.setDate(datedoc.getDate() + 7);
        let datestar = new Date(datedoc.getFullYear(), datedoc.getMonth(), datedoc.getDate());
        
        this.items = [{
        	xtype: 'form',
            padding: '15 17 15 17',
            border: false,
			modal: true,
            style: 'background-color: #f2f8fc;',
            waitMsgTarget: true,
            fieldDefaults: {
            	anchor: '100%',
                labelAlign: 'top',
                combineErrors: true,
                msgTarget: 'side'
            },
                items: [{
                    xtype: 'fieldcontainer',
                    combineErrors: true,
                    msgTarget: 'none', // qtip  title  under
                    margin: '0 2 5 2',
                    height: 63,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'description',
                            fieldLabel: 'Nombre de la Solicitud (Contiene)',
                            emptyText: 'Texto contenido en el nombre',
                            flex: 1,
                            margin: '0 5 10 5'
                        }, {
                            xtype: 'textfield',
                            name: 'code',
                            fieldLabel: 'No. 711',
                            width: 130,
                            emptyText: 'Ej. HCA9003',
                            margin: '0 5 10 5',
                            style: {
                                height: '35px !important'
                            }
                        }, {
                            xtype: 'combo',
                            id: 'rq-filterform-state',
                            queryMode: 'local',
                            forceSelection: true,
                            editable: false,
                            width: 130,
                            margin: '0 3 5 7',
                            fieldLabel: 'Estado',
                            name: 'state',
                            displayField: 'name',
                            valueField: 'value',
                            store: Ext.create('Ext.data.Store', {
                                fields : ['name', 'value'],
                                data: [
                                    {name : 'Todos', value: -1},
                                    {name : 'Circuito Firmas',  value: 1},
                                    {name : 'En Ofertas',  value: 2},
                                    {name : 'Contratado',  value: 3},
                                    {name : 'Suministrado',  value: 4}
                                ]
                            }),
                            value: -1
                        }
                    ]
                }, {
                    // Use the default, automatic layout to distribute the controls evenly
                    // across a single row
                    xtype: 'radiogroup',
                    margin: '10 8 15 8',
                    fieldLabel: 'Tipo de Presupuesto',
                    labelAlign: 'left',
                    labelWidth: 150,
                    anchor: 'none',
                    layout: {
                        autoFlex: false
                    },
                    defaults: {
                        name: 'ccType',
                        margin: '0 25 0 0'
                    },
                    items: [
                        {boxLabel: 'Todos', name: 'quote', inputValue: 'all', checked: true},
                        {boxLabel: 'Ejecuci\xF3n de Obra', inputValue: 'project', name: 'quote'},
                        {boxLabel: 'Garant\xEDa', inputValue: 'warranty', name: 'quote'}
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    height: 130,
                    msgTarget: 'none',
                    margin: '0 8 5 8',
                    items: [{
                            xtype: 'fieldset',
                            flex: 1,
                            height: 100,
                            title: 'Fecha de Creaci\xF3n',
                            defaultType: 'datefield',
                            layout: 'anchor',
                            padding: '5 15 5 15',
                            margin: '0 15 0 0',
                            defaults: {
                                anchor: '100%',
                                labelWidth: '8',
                                hideEmptyLabel: true
                            },
                            items: [{
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'none',
                                    layout: 'hbox',
                                    items: [{
                                            xtype: 'datefield',
                                            id: 'rq-filterform-created_start',
                                            editable: true,
                                            allowBlank: true,
                                            name: 'created_start',
                                            fieldLabel: 'Desde',
                                            format: 'd/m/Y',
                                            submitFormat: 'Y-m-d',
                                            flex: 1,
                                            labelAlign: 'top',
                                            margin: '0 5 3 3'
                                        }, {
                                            xtype: 'datefield',
                                            id: 'rq-filterform-created_end',
                                            editable: true,
                                            allowBlank: true,
                                            name: 'created_end',
                                            fieldLabel: 'Hasta',
                                            format: 'd/m/Y',
                                            submitFormat: 'Y-m-d',
                                            flex: 1,
                                            margin: '0 0 3 5',
                                            labelAlign: 'top',
                                            emptyText: 'Hoy',
                                        }]
                                }]
                        }, {
                            xtype: 'fieldset',
                            flex: 1,
                            height: 100,
                            title: 'Presentaci\xF3n a la UBI',
                            defaultType: 'datefield',
                            layout: 'anchor',
                            padding: '5 15 5 15',
                            margin: 0,
                            defaults: {
                                anchor: '100%',
                                labelWidth: '8',
                                hideEmptyLabel: true
                            },
                            items: [{
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'none',
                                    layout: 'hbox',
                                    items: [{
                                            xtype: 'datefield',
                                            id: 'rq-filterform-ubi_start',
                                            editable: true,
                                            allowBlank: true,
                                            name: 'ubi_start',
                                            fieldLabel: 'Desde',
                                            format: 'd/m/Y',
                                            submitFormat: 'Y-m-d',
                                            flex: 1,
                                            labelAlign: 'top',
                                            margin: '0 5 3 3'
                                        }, {
                                            xtype: 'datefield',
                                            id: 'rq-filterform-ubi_end',
                                            editable: true,
                                            allowBlank: true,
                                            name: 'ubi_end',
                                            fieldLabel: 'Hasta',
                                            format: 'd/m/Y',
                                            submitFormat: 'Y-m-d',
                                            flex: 1,
                                            margin: '0 0 3 5',
                                            labelAlign: 'top',
                                            emptyText: 'Hoy'
                                        }
                                    ]
                                }]
                        }]
                }
            ]
        }];
         
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                text: '<i class="fas fa-check"></i>&nbsp;Aceptar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 0 3 0',
                action: 'setfilterclose'
            }, {
                id: 'rq-filterform-cancelbtn',
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 15 3 5',
                scope: this,
                handler: this.close
            }]
        }];
 
        this.callParent(arguments);
    }
});