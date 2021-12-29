import { connect } from 'dva';
import { Redirect } from 'umi';
const auth = (props) => {
  const accessDic = {
    '/': '1001',
  };
  const funCode = accessDic[props.location.pathname];
  if (props.func.length === 0 || props.func[funCode]) {
    return props.children;
  } else {
    return <Redirect to="/" />;
  }
};
const mapStateToProps = (state) => ({
  userInfo: state.User.userInfo,
  func: state.User.func,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(auth);
