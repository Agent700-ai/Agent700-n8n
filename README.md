# Agent700 n8n Custom Nodes

Production-ready custom n8n nodes for integrating with the Agent700 API. These nodes provide seamless authentication, chat interactions, context management, and more.

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Node Documentation](#node-documentation)
- [Workflow Examples](#workflow-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Installation

### Install from npm (recommended for production)

Install the package in your n8n instance (or in your n8n project if using embedded nodes):

```bash
npm install @a700/n8n-nodes-agent700
```

- **Package:** [@a700/n8n-nodes-agent700](https://www.npmjs.com/package/@a700/n8n-nodes-agent700)
- Restart n8n after installing. The nodes appear as **Agent700 Agent** and **Agent700 Context Library**.

### Prerequisites

- n8n installed and running
- Node.js 18+ and npm
- Agent700 account credentials

### Build from source (optional)

To build and run from the repository:

```bash
git clone https://github.com/Agent700-ai/Agent700-n8n.git
cd Agent700-n8n
npm install
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Manual installation (Docker / custom path)

Choose the installation method that matches your n8n setup:

#### Option 1: Docker Setup (Recommended for Testing)

If you're using Docker Compose, you have two options:

**Option A: Volume Mount (Recommended)**

1. Update your `docker-compose.yml` to mount the built package:
   ```yaml
   volumes:
     - ./n8n-data:/home/node/.n8n/data
     - ./Agent700-n8n:/home/node/.n8n/custom/Agent700-n8n
   ```

2. Restart your containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Install dependencies inside the container:
   ```bash
   docker exec <CONTAINER_NAME> sh -c "cd /home/node/.n8n/custom/Agent700-n8n && npm install --production"
   ```

**Option B: Copy into Container**

1. Find your n8n container:
   ```bash
   docker ps | grep n8n
   ```

2. Copy the built package into the container:
   ```bash
   docker cp Agent700-n8n <CONTAINER_NAME>:/home/node/.n8n/custom/
   ```

3. Install dependencies inside container:
   ```bash
   docker exec <CONTAINER_NAME> sh -c "cd /home/node/.n8n/custom/Agent700-n8n && npm install --production"
   ```

4. Restart container:
   ```bash
   docker restart <CONTAINER_NAME>
   ```

#### Option 2: Local n8n Installation (Non-Docker)

If you have n8n installed locally (not in Docker):

1. Copy to n8n custom directory:
   ```bash
   # Find your n8n custom directory (usually ~/.n8n/custom)
   cp -r Agent700-n8n ~/.n8n/custom/
   
   # Install production dependencies
   cd ~/.n8n/custom/Agent700-n8n
   npm install --production
   ```

2. Set environment variable (if needed):
   ```bash
   export N8N_CUSTOM_EXTENSIONS=~/.n8n/custom
   ```

3. Restart n8n:
   ```bash
   # If running as service
   systemctl restart n8n
   
   # Or if running manually
   n8n start
   ```

#### Option 3: Using npm link (For Development)

For active development with hot reloading:

1. Build and link your package:
   ```bash
   cd Agent700-n8n
   npm install
   npm run build
   npm link
   ```

2. Link in n8n directory:
   ```bash
   # If n8n is installed globally
   cd $(npm root -g)/n8n
   npm link @a700/n8n-nodes-agent700
   
   # Or if n8n is in a specific directory
   cd /path/to/n8n
   npm link @a700/n8n-nodes-agent700
   ```

3. Restart n8n

**Note:** After making code changes, rebuild (`npm run build`) and restart n8n for changes to take effect.

### Verify Installation

After installation, verify everything works:

1. **Check nodes appear in n8n UI:**
   - Open n8n interface (typically `http://localhost:5678`)
   - Create a new workflow
   - Search for "Agent700" - you should see all nodes available:
     - Agent700 Agent
     - Agent700 Context Library

3. **Check n8n logs for errors:**
   ```bash
   # Docker
   docker logs <CONTAINER_NAME>
   
   # Local
   n8n start --log-level=debug
   ```

### Troubleshooting Installation

**Nodes don't appear:**
- Verify `dist/` folder exists and contains `.node.js` files
- Check `package.json` has correct `n8n.nodes` array
- Ensure file permissions are correct (Docker: check container user permissions)
- Restart n8n after installation
- Check n8n logs for specific error messages

**Dependencies missing:**
- Run `npm install --production` in the custom nodes directory
- For Docker: `docker exec <CONTAINER> sh -c "cd /home/node/.n8n/custom/Agent700-n8n && npm install --production"`

**Build errors:**
- Ensure TypeScript is installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify Node.js version is 18+

## Authentication

### How Authentication Works

All Agent700 nodes authenticate using an **App Password** configured directly in the node parameters. Nodes automatically handle authentication on each request - no manual token copying needed!

### Setting Up Authentication

1. **Get your App Password** from the Agent700 web interface
   - Format: `app_a7_` followed by 32 characters
   - Example: `app_a7_12345678901234567890123456789012`

2. **Configure in Node Parameters:**
   - **Base URL**: `https://api.agent700.ai` (default)
   - **App Password**: Your app password token (required)
   - Nodes automatically use this to obtain access tokens

### Authentication Flow

1. Node sends App Password to `/api/auth/app-login`
2. API returns an access token
3. Node uses Bearer token for all subsequent API calls
4. Token is obtained fresh for each execution

## Node Documentation

### 1. Agent700 Agent

**Purpose**: Send messages to agents and get structured responses

**Key Features:**
- Auto-authenticates using App Password
- Agent ID via manual entry
- Simplify output option for cleaner responses
- Full n8n UX guidelines compliance

**Parameters:**
- **Base URL**: `https://api.agent700.ai` (default)
- **App Password** (required): Your Agent700 app password token
- **Resource**: Chat (single resource)
- **Operation**: Send Message
- **Agent ID** (optional): Enter the Agent UUID manually
- **Message** (required): Your message to send
- **Simplify** (default: true): Return simplified output with key fields only

**Output (Simplified):**
```json
{
  "response": "Agent response",
  "finish_reason": "stop",
  "scrubbed_message": "...",
  "error": null,
  "prompt_tokens": 100,
  "completion_tokens": 50
}
```

**Output (Full):**
Returns complete API response with all fields.

**Example:**
```
1. Add "Agent700 Agent" node
2. Enter App Password
3. Enter Agent ID (UUID from Agent700 web interface)
4. Enter message: "What is AI?"
5. Enable Simplify for cleaner output (optional)
6. Execute
```

### 2. Agent700 Context Library

**Purpose**: Manage alignment data (key-value storage) with encryption at rest

**Key Features:**
- Full CRUD operations following n8n vocabulary
- Pattern matching and query operations
- JSON construction from patterns
- Auto-authenticates using App Password

**Resource**: Entry

**Operations:**
- **Get**: Retrieve a single entry by key
- **Get Many**: List all entries
- **Create**: Create a new entry
- **Update**: Update an existing entry (with optional key renaming)
- **Upsert**: Create or update an entry (upsert)
- **Delete**: Delete an entry (returns `{ deleted: true, key }`)
- **Query**: List key/value pairs matching a pattern
- **Query + Construct**: Construct JSON from pattern matches using a template

**Example (Upsert):**
```
1. Add "Agent700 Context Library" node
2. Enter App Password
3. Resource: Entry
4. Operation: "Upsert"
5. Key: "user_preference"
6. Value: {"theme": "dark_mode"}
7. Execute
```

**Example (Delete):**
```
1. Operation: "Delete"
2. Key: "old_key"
3. Returns: { "deleted": true, "key": "old_key" }
```


## Workflow Examples

### Example 1: Simple Chat Workflow

**Use Case**: One-off questions, simple Q&A

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Agent700 Agent** → Send message
   - Enter App Password
   - Select Agent ID
   - Message: "What is machine learning?"
3. **Display Response** → Show result

**Node Flow:**
```
Manual Trigger → Agent700 Agent → Display Response
```

**When to Use:**
- Quick questions
- Single message interactions
- No conversation history needed

---

### Example 2: Chat with Conversation Context

**Use Case**: Multi-turn conversations, follow-up questions

**Note**: Conversation context feature is not available in v2. For multi-turn conversations, manually include previous messages in your prompt or use the Context Library to store conversation history.

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Agent700 Agent** → First message
   - Enter App Password
   - Select Agent ID
   - Message: "Explain quantum computing"
3. **Agent700 Agent** → Follow-up
   - Include previous context in message
   - Message: "Based on your previous explanation, how does it differ from classical computing?"
4. **Display Response** → Show result

**Node Flow:**
```
Manual Trigger → Agent700 Agent → Agent700 Agent (with context) → Display
```

---

### Example 3: URL Evaluation Workflow

**Use Case**: Content analysis, privacy policy scanning, URL validation

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Get URLs** → Retrieve URLs (from Context Library or input)
3. **Split in Batches** → Process one at a time
4. **Agent700 Agent** → Evaluate each URL
   - Message: "Analyze this URL for privacy concerns: {{$json.url}}"
5. **Save Results** → Store in Context Library
6. **Aggregate** → Combine all evaluations

**Node Flow:**
```
Trigger → Get URLs → Split → Chat → Save → Aggregate
```

**Advanced Version:**
```
Trigger → Context Library (List) → Loop → Chat → Context Library (Upsert) → Summary
```

---

### Example 4: Context Library Management Workflow

**Use Case**: Dynamic context injection, data-driven conversations

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Agent700 Context Library** → List all data
   - Operation: "List All Data"
3. **Process Data** → Filter/transform as needed
4. **Agent700 Context Library** → Upsert new data
   - Operation: "Upsert Data"
   - Key: "user_context"
   - Value: "{{$json.processed_data}}"
5. **Agent700 Agent** → Use context in conversation
   - Message: "Based on this context: {{$json.user_context}}, answer my question"

**Node Flow:**
```
Trigger → Context Library (List) → Process → Context Library (Upsert) → Chat
```

---

### Example 8: Error Handling Workflow

**Use Case**: Production workflows, reliability-critical applications

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Agent700 Agent** → Attempt chat
3. **Error Handler** → Catch errors
4. **Retry Logic** → Retry on failure (with delay)
5. **Fallback Response** → Use cached/default response if all retries fail

**Node Flow:**
```
Trigger → Chat → Error Handler → Retry → Fallback
```

**Implementation Tips:**
- Use "Continue on Fail" option in nodes
- Implement retry with exponential backoff
- Cache successful responses for fallback

---

### Example 9: Batch Processing Workflow

**Use Case**: Bulk operations, data processing pipelines

**Steps:**
1. **Manual Trigger** → Start workflow
2. **Get Items** → Retrieve items to process (from Context Library, database, etc.)
3. **Split in Batches** → Process in batches
4. **Agent700 Agent** → Process each item
   - Message: "Process this item: {{$json.item}}"
5. **Aggregate Results** → Combine all results
6. **Save** → Store aggregated results

**Node Flow:**
```
Trigger → Get Items → Split → Chat (per item) → Aggregate → Save
```

**Performance Tips:**
- Process in parallel batches
- Use Continue on Fail for individual items
- Aggregate results efficiently


## Best Practices

### When to Use Which Node

- **Agent Node**: Regular chat interactions, sending messages to agents
- **Context Library Node**: Data storage, context injection, pattern matching

### Authentication Management

1. **Use App Passwords**
   - Required for all nodes
   - Can be revoked individually
   - Better audit trail
   - Format: `app_a7_` + 32 characters

2. **Store App Passwords Securely**
   - Use n8n's parameter encryption
   - Never hard-code in workflows
   - Rotate app passwords regularly
   - Consider using n8n environment variables for sensitive values

3. **One App Password Per Environment**
   - Separate app passwords for dev/staging/prod
   - Use different Agent IDs per environment

### Error Handling

1. **Enable Continue on Fail**
   - For batch processing
   - When individual failures shouldn't stop workflow

2. **Implement Retry Logic**
   - For transient errors (network, timeouts)
   - Use exponential backoff

3. **Log Errors Properly**
   - Use n8n's error handling
   - Store error details in Context Library for debugging

### Performance Tips

1. **Message Context**
   - Include previous messages manually in prompts when needed
   - Use Context Library to store conversation history
   - Limit context size to avoid token limits

2. **Batch Processing**
   - Process items in parallel when possible
   - Use Split in Batches node
   - Aggregate results efficiently

3. **Caching**
   - Cache agent configs in Context Library
   - Cache frequently accessed data
   - Use workflow static data for session management

### Security

1. **SSL/TLS Configuration**
   - Use "Strict SSL" in production
   - Only disable for development/testing

2. **Token Management**
   - Tokens auto-refresh via credentials

3. **Data Privacy**
   - Be careful with PII in messages
   - Use Context Library encryption features
   - Review scrubbed_message in responses

## Troubleshooting

### Common Issues

#### Authentication Fails

**Symptoms:**
- "Authentication failed" errors
- 401 Unauthorized responses
- "App login did not return accessToken" errors

**Solutions:**
1. Verify App Password is correct (format: `app_a7_` + 32 chars)
2. Check API Base URL is correct (`https://api.agent700.ai`)
3. Verify App Password is valid in Agent700 web interface
4. Try creating a new app password
5. Check network connectivity
6. Ensure App Password parameter is set in node (not empty)

#### Node Not Appearing

**Symptoms:**
- Can't find Agent700 nodes in n8n

**Solutions:**
1. Verify installation path is correct (see [Installation](#installation) section)
2. Check `dist/` folder exists and contains compiled `.node.js` files
3. Verify `package.json` n8n.nodes array matches actual file paths
4. Check file permissions (Docker: ensure container user can read files)
5. Restart n8n after installation
6. Check n8n logs for errors: `docker logs <CONTAINER>` or `n8n start --log-level=debug`
7. Verify TypeScript compiled successfully (`npm run build`)
8. For Docker: Ensure volume mount path is correct in `docker-compose.yml`
9. Install dependencies: `npm install --production` in the custom nodes directory

#### Agent ID Not Found

**Symptoms:**
- "Agent not found" errors

**Solutions:**
1. Verify the Agent UUID is correct (copy from Agent700 web interface)
2. Verify App Password is correct and has access to the agent
3. Check you have access to agents in Agent700 account
4. Verify API Base URL is correct

#### API Errors

**Symptoms:**
- 4xx/5xx HTTP errors
- "API Error" messages

**Solutions:**
1. Check error details in node output
2. Verify Agent UUID is correct
3. Check API rate limits
4. Review API documentation for endpoint changes
5. Enable Continue on Fail to see detailed errors

#### SSL/TLS Issues

**Symptoms:**
- Certificate errors
- Connection refused

**Solutions:**
1. Use "Strict SSL" in production
2. Check API Base URL uses HTTPS
3. Verify certificate is valid
4. Only use "Allow Self-Signed" for development

### Debugging Tips

1. **Check Node Output**
   - Look at `json` output for error details
   - Check `status` field for operation results

2. **Enable Continue on Fail**
   - See what errors occur
   - Don't stop workflow on first error

3. **Use Context Library for Logging**
   - Store debug information
   - Track workflow execution

4. **Test Individual Nodes**
   - Test each node separately
   - Verify credentials work
   - Check API connectivity

### Getting Help

1. **Check n8n Logs**
   - Look for error messages
   - Check execution logs

2. **Review API Documentation**
   - Agent700 API docs
   - n8n node development docs

3. **Test with Simple Workflow**
   - Start with basic chat
   - Add complexity gradually

## Workflow Templates

Ready-to-use workflow templates are available in the `workflows/` folder:

- `simple-chat.json` - Basic chat workflow
- `chat-with-context.json` - Conversation context example
- `url-evaluation.json` - URL evaluation workflow
- `context-library-management.json` - Context Library operations
- `error-handling.json` - Error handling example
- `batch-processing.json` - Batch processing workflow

**Note**: Workflow templates from v1 may need updates for v2:
- Replace credential references with App Password parameter
- Update node type names (`agent700Chat` → `agent700Agent`)
- Update operation names in Context Library node

**To import:**
1. In n8n, go to **Workflows** → **Import from File**
2. Select the JSON file from `workflows/` folder
3. Configure App Password in each node
4. Update Agent IDs if needed
5. Execute and customize

## License

MIT License - see LICENSE file for details.

## Support

- Check n8n documentation for general n8n issues
- Review Agent700 API documentation for API-specific issues
- Create issues in the repository for bugs or feature requests



