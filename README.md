<h1>🍳 Cookly - Recipe Sharing Platform</h1>

<p>A full-stack recipe sharing application built with Node.js/Express backend and React frontend, featuring user authentication, recipe management, and social interactions.</p>

<h2>✨ Features</h2>

<h3>👤 User Management</h3>
<ul>
<li><strong>🔐 Authentication System:</strong> JWT-based authentication with secure password hashing</li>
<li><strong>📝 Profile Management:</strong> Users can update profile information including name, bio, location, and avatar</li>
<li><strong>🔒 Privacy Settings:</strong> Configurable privacy preferences for profile visibility</li>
<li><strong>⚙️ Account Management:</strong> Password changes and account deletion with cascade cleanup</li>
</ul>

<h3>🍽️ Recipe System</h3>
<ul>
<li><strong>📋 Recipe CRUD Operations:</strong> Create, read, update, and delete recipes</li>
<li><strong>❤️ Social Features:</strong> Recipe likes, bookmarks, and ratings</li>
<li><strong>👨‍🍳 User Recipe Collections:</strong> View recipes by specific users</li>
</ul>

<h3>🎨 Frontend Interface</h3>
<ul>
<li><strong>📱 Responsive Design:</strong> Modern React interface with dark/light theme support</li>
<li><strong>⚙️ Settings Management:</strong> Comprehensive user settings with tabbed interface</li>
<li><strong>🔍 Recipe Discovery:</strong> Search and filtering capabilities for recipe browsing</li>
</ul>

<h2>🛠️ Tech Stack</h2>

<h3>Backend 🖥️</h3>
<ul>
<li><strong>Node.js/Express:</strong> RESTful API server</li>
<li><strong>MongoDB/Mongoose:</strong> Database with schema validation</li>
<li><strong>bcryptjs:</strong> Password hashing and authentication</li>
<li><strong>JWT:</strong> Token-based authentication</li>
</ul>

<h3>Frontend 🌐</h3>
<ul>
<li><strong>React:</strong> Component-based UI framework</li>
<li><strong>Zustand:</strong> State management for user data and UI preferences</li>
<li><strong>React Router:</strong> Client-side routing</li>
<li><strong>Tailwind CSS:</strong> Utility-first styling with dark mode support</li>
</ul>

<h2>🔗 API Endpoints</h2>

<h3>🔐 Authentication <code>/api/auth</code></h3>
<ul>
<li><code>POST /api/auth/register</code> - 📝 User registration</li>
<li><code>POST /api/auth/login</code> - 🔑 User login</li>
</ul>

<h3>👤 User Management <code>/api/users</code></h3>
<p><strong>🔒 Authenticated Operations:</strong></p>
<ul>
<li><code>GET /api/users/me</code> - 👤 Get current user profile</li>
<li><code>PUT /api/users/me</code> - ✏️ Update current user profile</li>
<li><code>DELETE /api/users/me</code> - 🗑️ Delete current user account</li>
<li><code>GET /api/users/me/recipes</code> - 📋 Get current user's recipes</li>
<li><code>PUT /api/users/me/password</code> - 🔑 Change user password</li>
</ul>

<p><strong>🌐 Public Operations:</strong></p>
<ul>
<li><code>GET /api/users/:id</code> - 👁️ Get public user profile</li>
<li><code>GET /api/users/:id/recipes</code> - 📖 Get specific user's recipes</li>
</ul>

<h3>🍽️ Recipe Management <code>/api/recipes</code></h3>
<ul>
<li><code>GET /api/recipes</code> - 📋 Get all recipes (with search/filtering)</li>
<li><code>POST /api/recipes</code> - ➕ Create new recipe (authenticated)</li>
<li><code>GET /api/recipes/:id</code> - 👁️ Get specific recipe details</li>
<li><code>PUT /api/recipes/:id</code> - ✏️ Update recipe (authenticated, author only)</li>
<li><code>DELETE /api/recipes/:id</code> - 🗑️ Delete recipe (authenticated, author only)</li>
<li><code>POST /api/recipes/:id/like</code> - ❤️ Like/unlike recipe (authenticated)</li>
<li><code>POST /api/recipes/:id/bookmark</code> - 🔖 Bookmark/unbookmark recipe (authenticated)</li>
</ul>

<h3>💬 Comments <code>/api/recipes/:id/comments</code></h3>
<ul>
<li><code>GET /api/recipes/:id/comments</code> - 👁️ Get comments for a recipe</li>
<li><code>POST /api/recipes/:id/comments</code> - 💬 Add comment to recipe (authenticated)</li>
<li><code>DELETE /api/recipes/:id/comments/:commentId</code> - 🗑️ Delete comment (authenticated, author only)</li>
</ul>

<hr>
