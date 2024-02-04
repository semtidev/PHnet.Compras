Ext.define('PHNet.view.app.ReplaceWindow', {
    extend: 'Ext.window.Window',
    id: 'replacewindow',
    alias: 'widget.replacewindow',
    requires: ['Ext.form.*'],
    title: '<i class="fas fa-user-friends fa-sm"></i>&nbsp;&nbsp;Designar Remplazo Temporal',
    layout: 'fit',
    animateTarget: 'dropdown-user',
    autoShow: true,
    resizable: false,
    width: 480,
    height: 465,
    modal: true,
    initComponent: function() {

        // Let dates document
        let datedoc = new Date();
        datedoc.setDate(datedoc.getDate() + 7);
        let datestar = new Date(datedoc.getFullYear(), datedoc.getMonth(), datedoc.getDate());

        this.items = [{
            xtype: 'form',
            padding: '15 20 15 20',
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
                xtype: 'textfield',
                name: 'id_user',
                value: localStorage.getItem('phcp_ui'),
                hidden: true
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                anchor: '100%',
                region: 'center',
                height: 53,
                margin: 0,
                padding: 0,
                items: [{
                    xtype: 'component',
                    html: '<i class="fas fa-info-circle icon_darkblue fa-2x"></i>',
                    width: 40,
                    margin: '5 0 0 0'
                }, {
                    xtype: 'component',
                    html: 'Durante su Ausencia Planificada temporal de la entidad, designe los Directivos que Aprobarán las Solicitudes de Compra.',
                    style: { color: '#333' },
                    flex: 1
                }]
            }, {
                xtype: 'fieldcontainer',
                combineErrors: true,
                msgTarget: 'none', // qtip  title  under
                margin: '15 10 5 10',
                height: 80,
                layout: 'hbox',
                items: [{
                    xtype: 'component',
                    width: 60,
                    height: 60,
                    html: '<img class="replace-avatar" src="/phnet.compras/public/dist/img/users/89030933694.jpg"/>'
                }, {
                    xtype: 'component',
                    html: '<span class="material-field-title">Director de Proyecto</span><br><span class="material-field-text">Ing. Liliana Mayea Guerra</span>',
                    margin: '5 10 0 15',
                    flex: 1
                }, {
                    xtype: 'checkboxfield',
                    margin: '20 0 0 0',
                    boxLabel: 'Autorizado',
                    checked: true,
                    name: 'director2'
                }]
            }, {
                xtype: 'fieldcontainer',
                combineErrors: true,
                msgTarget: 'none', // qtip  title  under
                margin: '0 10 5 10',
                height: 80,
                layout: 'hbox',
                items: [{
                    xtype: 'component',
                    width: 60,
                    height: 60,
                    html: '<img class="replace-avatar" src="/phnet.compras/public/dist/img/users/67070422281.jpg"/>'
                }, {
                    xtype: 'component',
                    html: '<span class="material-field-title">Director de Proyecto</span><br><span class="material-field-text">Ing. Dionedy L\xF3pez Castillo</span>',
                    margin: '5 10 0 15',
                    flex: 1
                }, {
                    xtype: 'checkboxfield',
                    margin: '20 0 0 0',
                    boxLabel: 'Autorizado',
                    checked: true,
                    name: 'director3'
                }]
            }, {
                xtype: 'fieldset',
                flex: 1,
                height: 100,
                title: 'Ausencia Planificada',
                defaultType: 'datefield',
                layout: 'anchor',
                padding: '5 15 5 15',
                margin: '0 2 5 2',
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
                        editable: false,
                        allowBlank: false,
                        name: 'date_from',
                        fieldLabel: 'Desde',
                        format: 'd/m/Y',
                        submitFormat: 'Y-m-d',
                        flex: 1,
                        minValue: new Date(),
                        labelAlign: 'top',
                        margin: '0 7 3 3'
                    }, {
                        xtype: 'datefield',
                        editable: false,
                        allowBlank: false,
                        name: 'date_to',
                        fieldLabel: 'Hasta',
                        format: 'd/m/Y',
                        submitFormat: 'Y-m-d',
                        flex: 1,
                        minValue: new Date(),
                        margin: '0 0 3 7',
                        labelAlign: 'top'
                    }]
                }]
            }]
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                id: 'replacement-okbtn',
                text: '<i class="fas fa-check"></i>&nbsp;Aceptar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 0 3 0',
                action: 'replacement'
            }, {
                id: 'replacement-cancelbtn',
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