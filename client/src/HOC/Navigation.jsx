import {useNavigate,useParams} from 'react-router-dom';


function withNavigation(Component) {
    return props => <Component {...props} navigate={useNavigate()} params={useParams()}/>;
  }
  


  export { withNavigation };