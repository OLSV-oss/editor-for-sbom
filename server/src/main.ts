import {
    Connection,
    createConnection,
    ProposedFeatures,
} from "vscode-languageserver/node";

import { Server } from "./server/server";
import { Logger } from "./server/logger";

// Create a connection for the server.
const connection: Connection = createConnection(ProposedFeatures.all);
if (connection === undefined) {
	// break
}
// Start Server.
new Server(connection, new Logger(connection)).start();