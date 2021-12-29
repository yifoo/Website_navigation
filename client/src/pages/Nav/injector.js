import { connect } from 'dva';

const mapStateToProps = (state) => ({
  bgImg: state.Nav.bgImg,
  searchList: state.Nav.searchList,
  siteList: state.Nav.siteList,
  placeholder: state.Nav.placeholder,
  isLoading: state.Nav.isLoading,
  isEdit: state.Nav.isEdit,
  showEditSite: state.Nav.showEditSite,
  orderVal: state.Nav.orderVal,
  isMobile: state.global.isMobile,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSearchList(params) {
    return dispatch({
      type: 'Nav/querySearchList',
      payload: params,
    });
  },
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
