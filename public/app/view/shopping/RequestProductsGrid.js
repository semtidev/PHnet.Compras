Ext.define('PHNet.view.shopping.RequestProductsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.requestproductsgrid',
    id: 'requestproductsgrid',
    requires: [
        'Ext.grid.*',
        'Ext.Form.*',
        'Ext.grid.plugin.CellEditing'
    ],
    userCreate: 0,
    store: 'shopping.Requestproducts',
    listeners: {
        'afterrender': function(grid, opt) {
            if (localStorage.getItem('phcp_a')) {
                let user_dpto = localStorage.getItem('phcp_ud');
                if ((user_roles.includes('Especialista de Obra') && this.userCreate == 1) || (user_roles.includes('Especialista de Compras') && this.userCreate == 1) || (user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto) && user_works.includes(user_reqwork.toString()))) {
                    Ext.getCmp('shopping_products_columndel').show();
                }
            }
        },
        'cellclick': function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            let id = record.data.id;
            if (localStorage.getItem('phcp_a')) {
                let user_dpto = localStorage.getItem('phcp_ud');

                if ((user_roles.includes('Especialista de Obra') && this.userCreate == 1) || (user_roles.includes('Especialista de Compras') && this.userCreate == 1) || (user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto) && user_works.includes(user_reqwork.toString()))) {

                    if (cellIndex == 0) {
                        this.fireEvent('deleteclick', id);
                    } else if (cellIndex == 2) {
                        //if (localStorage.getItem('userrol')) {
                        var animtarget = 'photolnk-product-' + id;
                        this.fireEvent('photoclick', record, animtarget);
                        //}
                    }
                }
            } else {
                if (cellIndex == 2) {
                    //if (localStorage.getItem('userrol')) {
                    var animtarget = 'photolnk-product-' + id;
                    this.fireEvent('photoclick', record, animtarget);
                    //}
                }
            }
        }
    },
    autoScroll: true,
    viewConfig: {
        columnLines: true,
        stripeRows: true
    },
    initComponent: function() {

        let me = this,
            requestGrid = Ext.getCmp('shopp711tab'),
            requestRecord = requestGrid.getSelectionModel().getSelection()[0],
            project = requestRecord.get('work_id'),
            cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
                pluginId: 'requestproductsgridEditing',
                clicksToEdit: 2
            });

        // Access Cell Edit
        if (localStorage.getItem('phcp_a')) {

            let user_dpto = localStorage.getItem('phcp_ud');

            if ((user_roles.includes('Especialista de Obra') && me.userCreate == 1) || (user_roles.includes('Especialista de Compras') && me.userCreate == 1) || (user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto) && user_works.includes(user_reqwork.toString()))) {
                me.plugins = [cellEditingPlugin];
            }
        }

        me.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [{
                id: 'shopping_products_columndel',
                width: 40,
                hidden: true,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let id = record.get('id');
                        if (id > 0) {
                            metaData['tdAttr'] = 'data-qtip="Eliminar Producto"';
                            metaData.tdCls = 'row-icon';
                            return '<a><i class="fas fa-minus-circle icon-red"></i></a>';
                        } else {
                            return ' ';
                        }
                    }
                }
            }, {
                header: 'No',
                width: 40,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let id = record.get('id');
                        if (id > 0) {
                            return record.index + 1;
                        }
                    }
                }
            }, {
                header: 'Foto',
                width: 50,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let id = record.get('id'),
                            photo = record.get('photo');
                        if (localStorage.getItem('phcp_a')) {
                            let user_dpto = localStorage.getItem('phcp_ud');

                            if ((user_roles.includes('Especialista de Obra') && this.userCreate == 1) || (user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto) && user_works.includes(user_reqwork.toString()))) {

                                if (id > 0) {
                                    if (photo != '' && photo != null) {
                                        metaData['tdAttr'] = 'data-qtip="<div class=photo><img src=/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + ' width=130 height=80></div>Click para Mostrar Foto"';
                                        metaData.tdCls = 'row-icon';
                                        return '<a id="photolnk-product-' + record.get('id') + '"><img src="/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + '"width="24" height="20"></a>';
                                    } else {
                                        metaData['tdAttr'] = 'data-qtip="<div class=photo><img src=/phnet.compras/public/dist/img/nophoto.png width=130 height=80></div>Click para Agregar Foto"';
                                        metaData.tdCls = 'row-icon';
                                        return '<a id="photolnk-product-' + record.get('id') + '"><i class="fas fa-file-image icon-gray"></i></a>';
                                    }
                                } else {
                                    return ' ';
                                }
                            } else {
                                if (id > 0) {
                                    if (photo != '' && photo != null) {
                                        metaData['tdAttr'] = 'data-qtip="<div class=photo><img src=/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + ' width=130 height=80></div>Click para Mostrar Foto"';
                                        metaData.tdCls = 'row-icon';
                                        return '<a href="/phnet.compras/storage/app/public/products/' + record.get('photo') + '" target="_blank"><img src="/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + '"width="24" height="20"></a>';
                                    } else {
                                        metaData['tdAttr'] = 'data-qtip="Sin Foto"';
                                        metaData.tdCls = 'row-icon';
                                        return '<i class="fas fa-file-image icon-gray"></i>';
                                    }
                                } else {
                                    return ' ';
                                }
                            }
                        } else {
                            if (id > 0) {
                                if (photo != '' && photo != null) {
                                    metaData['tdAttr'] = 'data-qtip="<div class=photo><img src=/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + ' width=130 height=80></div>Click para Mostrar Foto"';
                                    metaData.tdCls = 'row-icon';
                                    return '<a href="/phnet.compras/storage/app/public/products/' + record.get('photo') + '" target="_blank"><img src="/phnet.compras/storage/app/public/products/medium/' + record.get('photo') + '"width="24" height="20"></a>';
                                } else {
                                    metaData['tdAttr'] = 'data-qtip="Sin Foto"';
                                    metaData.tdCls = 'row-icon';
                                    return '<i class="fas fa-file-image icon-gray"></i>';
                                }
                            } else {
                                return ' ';
                            }
                        }
                    }
                }
            }, {
                header: 'C\xF3digo',
                dataIndex: 'code',
                width: 100,
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 191,
                    selectOnFocus: true
                }
            }, {
                header: 'Descripci\xF3n del producto',
                dataIndex: 'description',
                flex: 1,
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 191,
                    selectOnFocus: true
                },
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + val + '"';
                    return val;
                }
            }, {
                header: 'U/M',
                dataIndex: 'um',
                width: 60,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 191,
                    selectOnFocus: true
                }
            }, {
                header: 'Ctdad',
                dataIndex: 'ctdad',
                width: 100,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    //minValue: 0,
                    //step: .1,
                    selectOnFocus: true
                }
            }, {
                header: 'Precio CUP',
                dataIndex: 'price',
                width: 100,
                align: 'right',
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'numberfield',
                    minValue: 0,
                    step: .00001,
                    decimalPrecision: 5,
                    selectOnFocus: true
                }
            }, {
                header: 'Caracter\xEDsticas Tecnicas',
                dataIndex: 'characteristic',
                flex: 1,
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 191,
                    selectOnFocus: true
                },
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record.get('characteristic') != null && record.get('characteristic') != '') {
                        metaData['tdAttr'] = 'data-qtip="' + val + '"';
                        return val;
                    } else {
                        return;
                    }
                }
            }]
        };

        this.callParent(arguments);

        // Add Events
        me.addEvents('recordedit');
        me.on('edit', function(edt, e) {
            let record = {
                id: e.record.data.id,
                field: e.column.dataIndex,
                oldvalue: e.originalValue,
                newvalue: e.value,
                rowIdx: e.rowIdx,
                colIdx: e.colIdx,
                data: e.record.data
            }
            this.fireEvent('recordedit', record);
        });
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