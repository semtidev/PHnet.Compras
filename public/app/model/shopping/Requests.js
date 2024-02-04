Ext.define('PHNet.model.shopping.Requests', {
    extend: 'Ext.data.Model',
    fields: ['id', 'document_date', 'codedb', 'code', 'name', 'approval_number', 'management_code', 'comment', 'request_date', 'work_id', 'work_name', 'work_abbr', 'department', 'dpto_ids', 'state', 'quote', 'document', 'parent', 'children', 'created_by', 'approved', 'totalcomments', 'esp_confirm', 'dpto_confirm', 'comp_comfirm', 'dir_confirm', 'gendir_aprove', 'gendir_reject', 'created']
});