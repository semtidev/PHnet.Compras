Ext.define('PHNet.view.shopping.RequestCommentsGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.requestcommentsgrid',
    id: 'requestcommentsgrid',
    requires: [
        'Ext.grid.*',
        'Ext.Form.*',
        'Ext.grid.plugin.CellEditing'
    ],
    store: 'shopping.Requestcomments',
    listeners: {
        'cellclick': function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            var id = record.data.id;
            if (cellIndex == 0) {
                if (record.data.id_user == localStorage.getItem('phcp_ui')) {
                    this.fireEvent('deleteclick', id);
                } else {
                    return;
                }
            }
        }
    },
    autoScroll: true,
    viewConfig: {
        //columnLines: true,
        stripeRows: true
    },
    initComponent: function() {

        var me = this,
            cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
                pluginId: 'reqcommentsGridEditing',
                clicksToEdit: 2
            });

        me.plugins = [cellEditingPlugin];
        me.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [{
                width: 40,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        var id = record.get('id');
                        if (record.get('id_user') == localStorage.getItem('phcp_ui')) {
                            metaData['tdAttr'] = 'data-qtip="Eliminar Comentario"';
                            metaData.tdCls = 'row-icon';
                            return '<a><i class="fas fa-minus-circle icon-red"></i></a>';
                        } else {
                            return ' ';
                        }
                    }
                }
            }, {
                header: 'Usuario',
                id: 'col-comments-photo',
                dataIndex: 'photo',
                width: 65,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let photo = record.get('photo'),
                            user = record.get('user_name');
                        metaData['tdAttr'] = 'data-qtip="<div class=photo_user><img src=/phnet.compras/public/dist/img/users/' + photo + ' width=100 height=100><br>' + user + '</div>"';
                        metaData.tdCls = 'row-icon';
                        return '<img src="/phnet.compras/public/dist/img/users/' + photo + '"width="50" height="50"></a>';
                    }
                }
            }, {
                header: 'Comentario',
                id: 'col-comments-request',
                dataIndex: 'comment',
                flex: 1,
                menuDisabled: true,
                sortable: false,
                emptyCellText: '',
                editor: {
                    xtype: 'textfield',
                    maxLength: 191,
                    selectOnFocus: true,
                    emptyText: 'Hasta 190 caracteres'
                }
            }, {
                header: 'Fecha',
                dataIndex: 'created_at',
                align: 'center',
                width: 100,
                menuDisabled: true,
                sortable: false
            }]
        };

        this.callParent(arguments);

        // Add Events
        me.addEvents('recordedit');
        me.on('edit', function(edt, e) {
            var record = {
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
        console.log(e);
        this.fireEvent('recordedit', e);
    }
});