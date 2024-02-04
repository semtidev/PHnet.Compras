var year = new Date().getFullYear();
Ext.define('PHNet.store.Yearcombo', {
    extend: 'Ext.data.Store',
    fields: ['value', 'label'],
    data : [
        {'value': -1, 'label': 'Todos los A\xF1os'},
        {'value': year, 'label': year},
        {'value': year - 1, 'label': year - 1},
        {'value': year - 2, 'label': year - 2},
        {'value': year - 3, 'label': year - 3},
        {'value': year - 4, 'label': year - 4},
    ]
});