import { createConsumer } from '@rails/actioncable';

const cable = createConsumer(process.env.NEXT_PUBLIC_CABLE_URL);

export default cable;
