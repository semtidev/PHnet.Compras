Ext.define('PHNet.view.app.WorksGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'worksgrid',
    id: 'worksgrid',
    requires: [
        'Ext.grid.*',
        'Ext.grid.plugin.CellEditing'
    ],
    store: 'Work',
    listeners: {
        'render': function(grid, opt) {
            var windowHeight = Ext.getCmp('configwindow').getHeight();
            grid.setHeight(windowHeight - 127);
        },
        'cellclick': function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            var id = record.data.id;
            if (cellIndex == 0) {
                this.fireEvent('deleteclick', id);
            }
        },
        'celldblclick': function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            var id = record.data.id;                
            if (cellIndex == 3) {
                var state = record.data.shoppingrequest;
                this.fireEvent('enableModule', 'requests', id, state);
            }
            else if (cellIndex == 4) {
                var state = record.data.contracts;
                this.fireEvent('enableModule', 'contracts', id, state);
            }
            else if (cellIndex == 5) {
                var state = record.data.planning;
                this.fireEvent('enableModule', 'planning', id, state);
            }
        }
    },
    viewConfig: {
        columnLines: true,
        stripeRows: true
    },
    autoShow: true,
    frame: false,
    layout: 'fit',
    initComponent: function() {
        var me = this,
            cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', { 
                pluginId:'worksGridEditing', 
                clicksToEdit: 2,
            });

        me.plugins = [cellEditingPlugin];
        me.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [
                {
                    text: ' ',
                    width: 40,
					align: 'center',
                    menuDisabled: true,
                    sortable: false,
                    renderer: function(val, metaData, record, colIndex, store) {
                        if (record !== null) {
                            var id = record.get('id');
                            if (id > 0) {
                                metaData['tdAttr'] = 'data-qtip="Eliminar Obra"';
                                metaData.tdCls = 'row-icon';
                                return '<a><i class="fas fa-minus-circle icon-red"></a>';
                            }
                            else {
                                return ' ';
                            }
                        }
                    }
                }, {
                    text: 'Nombre',
                    dataIndex: 'name',
                    menuDisabled: true,
                    align: 'left',
                    flex: 1,
                    emptyCellText: '',
                    editor: {
                        xtype: 'textfield',
                        selectOnFocus: true
                    }
                }, {
                    text: 'Abreviatura',
                    dataIndex: 'abbr',
                    menuDisabled: true,
                    align: 'left',
                    flex: 1,
                    editor: {
                        xtype: 'textfield',
                        selectOnFocus: true
                    }
                }, {
                    header: "Habilitado para los M&oacute;dulos",
                    align: 'center',
                    menuDisabled: true,
                    columns: [
                        {
                            text: 'Solicitudes de Compra',
                            dataIndex: 'shoppingrequest',
                            menuDisabled: true,
                            align: 'center',
                            width: 200,
                            renderer: function(val, metaData, record, colIndex, store) {
                                if (record !== null) {
                                    if (val == 1) {
                                        metaData['tdAttr'] = 'data-qtip="Habilitado (Para cambiar haga doble click)"';
                                        return '<i class="fas fa-check">';
                                    }
                                    else {
                                        metaData['tdAttr'] = 'data-qtip="Deshabilitado (Para cambiar haga doble click)"';
                                        return null;
                                    }
                                }
                            }
                        }, {
                            text: 'Contrataci\xF3n',
                            dataIndex: 'contracts',
                            menuDisabled: true,
                            align: 'center',
                            width: 100,
                            renderer: function(val, metaData, record, colIndex, store) {
                                if (record !== null) {
                                    if (val == 1) {
                                        metaData['tdAttr'] = 'data-qtip="Habilitado (Para cambiar haga doble click)"';
                                        return '<i class="fas fa-check">';
                                    }
                                    else {
                                        metaData['tdAttr'] = 'data-qtip="Deshabilitado (Para cambiar haga doble click)"';
                                        return null;
                                    }
                                }
                            }
                        }, {
                            text: 'Planificaci\xF3n',
                            dataIndex: 'planning',
                            menuDisabled: true,
                            align: 'center',
                            width: 100,
                            renderer: function(val, metaData, record, colIndex, store) {
                                if (record !== null) {
                                    if (val == 1) {
                                        metaData['tdAttr'] = 'data-qtip="Habilitado (Para cambiar haga doble click)"';
                                        return '<i class="fas fa-check">';
                                    }
                                    else {
                                        metaData['tdAttr'] = 'data-qtip="Deshabilitado (Para cambiar haga doble click)"';
                                        return null;
                                    }
                                }
                            }
                        }
                    ]
                }
                    
            ]
        };

        me.callParent(arguments);

        // Load Store
        var proxy = me.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/works/all'
        });
        me.getStore().load();

        // Add Events
        me.addEvents(

            /**
             * @event edit
             * Fires when a record is edited using the CellEditing plugin or the statuscolumn
             * @param {SimpleTasks.model.Task} task     The task record that was edited
             */
            'recordedit'
        );

        cellEditingPlugin.on('edit', me.handleCellEdit, this);
    },

    /**
     * Handles the CellEditing plugin's "edit" event
     * @private
     * @param {Ext.grid.plugin.CellEditing} editor
     * @param {Object} e an edit event object
     */
    handleCellEdit: function(editor, e) {
        this.fireEvent('recordedit', e);
    }

});