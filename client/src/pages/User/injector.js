import { connect } from 'dva';

const mapStateToProps = (state) => ({
  bgImg: state.Nav.bgImg,
  isMobile: state.global.isMobile,
});

const mapDispatchToProps = (dispatch) => ({
  clearUserInfo(params) {
    return dispatch({
      type: 'Nav/clearUserInfo',
      payload: params,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
