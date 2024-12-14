// SucessDoneAnimation.tsx
import { CircularProgress } from '@mui/material';

const SuccessDoneAnimation = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      zIndex: 1000,
    }}>
      <CircularProgress size={60} style={{ color: 'green' }} />
      <h3>Order Successful!</h3>
    </div>
  );
};

export default SuccessDoneAnimation;
