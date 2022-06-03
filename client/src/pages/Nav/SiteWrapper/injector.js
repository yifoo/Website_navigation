import { connect } from 'dva';

const mapStateToProps = (state) => ({
  siteList: state.Nav.siteList,
  orderVal: state.Nav.orderVal,
  isEdit: state.Nav.isEdit,
});

const mapDispatchToProps = (dispatch) => ({
  setIsLoading(params) {
    return dispatch({
      type: 'Nav/setIsLoading',
      payload: params,
    });
  },
  setOrderSiteList(params) {
    return dispatch({
      type: 'Nav/setOrderSiteList',
      payload: params,
    });
  },
  fetchAllSites(params) {
    return dispatch({
      type: 'Nav/fetchAll',
      payload: params,
    });
  },
  fetchSort(params) {
    return dispatch({
      type: 'Nav/fetchSort',
      payload: params,
    });
  },
  addSort(params) {
    return dispatch({
      type: 'Nav/addSort',
      payload: params,
    });
  },
  updateSortOrder(params) {
    return dispatch({
      type: 'Nav/updateSortOrder',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
