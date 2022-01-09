import * as Progress from 'react-native-progress';
import PropTypes from 'prop-types';


const propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.string,
};

const defaultProps = {
  value: 100,
  max: 100,
  color: null,
};


const StatusGauge = ({value, max, color}) => {     
  return (<Progress.Bar progress={value/max} style={{width:"100%"}}/>);
} 

StatusGauge.propTypes = propTypes;
StatusGauge.defaultProps = defaultProps;

export default StatusGauge;