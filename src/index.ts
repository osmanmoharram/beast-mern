'use strict';

import env from './bootstrap/env.ts';
import app from './bootstrap/app.ts';

const port = env.port;
app.listen(port, () => console.log(`Api listening on ${port}`));