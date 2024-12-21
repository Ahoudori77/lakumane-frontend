import { createConsumer } from "@rails/actioncable";

const cable = createConsumer(process.env.REACT_APP_CABLE_URL || "ws://localhost:3000/cable");

export default cable;
