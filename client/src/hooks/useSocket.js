import { useContext } from 'react';
import { SocketContext } from 'src/contexts/SocketContext';



// ----------------------------------------------------------------------

const useSocket = () => useContext(SocketContext);

export default useSocket;