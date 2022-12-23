import { Form, Input, message, Modal, Select } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
const EditSortModal = (props) => {
  const [sortForm] = Form.useForm();
  // 修改网址
  const handleOk = () => {
    sortForm
      .validateFields()
      .then((params) => {
        let data = {
          sortId: props.sortInfo.subSortId,
          sortName: params.sortName,
          parentId: params.sort.value,
        };
        let oldData = {
          sortId: props.sortInfo.subSortId,
          sortName: props.sortInfo.subSortName,
          parentId: props.sortInfo.sortId,
        };
        if (JSON.stringify(data) === JSON.stringify(oldData)) {
          message.warn('未做任何修改');
          return false;
        }
        props.updateSort(data).then((resp) => {
          if (resp) {
            props.setShowEditSubSort(false);
          }
        });
      })
      .catch((errorInfo) => {
        console.log('errorInfo: ', errorInfo);
      });
  };
  const handleCancel = () => {
    props.setShowEditSubSort(false);
  };
  useEffect(() => {
    sortForm.setFieldsValue({
      sort: { value: props.sortInfo.sortId, label: props.sortInfo.sortName },
      sortName: props.sortInfo.subSortName,
    });
  }, [JSON.stringify(props.sortInfo), sortForm]);
  return (
    <>
      <Modal
        forceRender={true}
        getContainer={false}
        title="编辑分类"
        visible={props.showEditSubSort}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={sortForm} name="siteForm" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} autoComplete="off">
          <Form.Item
            label="上级分类"
            name="sort"
            rules={[
              {
                required: true,
                message: '请选择分类',
              },
            ]}
          >
            <Select
              labelInValue={true}
              options={props.sortList}
              fieldNames={{
                label: 'sortName',
                value: 'sortId',
              }}
            />
          </Form.Item>
          <Form.Item
            label="当前分类"
            name="sortName"
            rules={[
              {
                required: true,
                message: '请输入分类名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  showEditSubSort: state.Nav.showEditSubSort,
  sortList: state.Nav.sortList,
  originSiteList: state.Nav.originSiteList,
  sortInfo: state.Nav.sortInfo,
});

const mapDispatchToProps = (dispatch) => ({
  setShowEditSubSort(params) {
    return dispatch({
      type: 'Nav/setShowEditSubSort',
      payload: params,
    });
  },
  setSiteList(params) {
    return dispatch({
      type: 'Nav/setSiteList',
      payload: params,
    });
  },
  updateSort(params) {
    return dispatch({
      type: 'Nav/updateSort',
      payload: params,
    });
  },
  fetchSort(params) {
    return dispatch({
      type: 'Nav/fetchSort',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSortModal);
