import { connect } from 'dva';

const mapStateToProps = (state) => ({
  siteList: state.Nav.siteList,
  isLoading: state.Nav.isLoading,
  showEditSite: state.Nav.showEditSite,
  orderVal: state.Nav.orderVal,
  // isMobile: state.global.isMobile,
  sortList: state.Nav.sortList,
  isEdit: state.Nav.isEdit,
});

const mapDispatchToProps = (dispatch) => ({
  setIsLoading(params) {
    return dispatch({
      type: 'Nav/setIsLoading',
      payload: params,
    });
  },
  setSiteList(params) {
    return dispatch({
      type: 'Nav/setSiteList',
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
  updateSite(params) {
    return dispatch({
      type: 'Nav/updateSite',
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
    console.log('params: ', params);
    return dispatch({
      type: 'Nav/updateSortOrder',
      payload: params,
    });
  },
  setOrderVal(params) {
    return dispatch({
      type: 'Nav/setOrderVal',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
