# APIDocumentation - Les Fabricants de Joie

This document serves as an exhaustive reference for the current REST API implementation. It outlines the architectural patterns, endpoints, parameters, and responses. Please use this document to inform your future components, hooks, or service implementations within this application.

## Architectural Guidelines

This implementation follows a **Server Component & Service Pattern** architecture:
1. **API Routes (Controllers)**: Located in `src/app/api/.../route.ts`. Their scope is strictly limited to handling HTTP protocol logic (authorization parsing, param extraction, request validation, and response mapping). **They do not interact directly with the database or Prisma**.
2. **Service Layer**: Located in `src/services/*.service.ts`. Contains all business logic and Prisma database invocations.

When interacting with the database from React Server Components or Server Actions, **ALWAYS** call functions from the Service Layer directly rather than making extraneous HTTP requests to the API Routes.

---

## Endpoint Specifications

### 1. Posts Management

#### `GET /api/posts` -> Public & Admin Blog Listing
Retrieves a paginated list of blog articles.

**Query Parameters:**
- `page` (optional, default: `1`): Current page.
- `limit` (optional, default: `9`): Number of items per page.
- `category` (optional): Filter posts by category slug.
- `tag` (optional): Filter posts by a tag slug.
- `featured` (optional, boolean): Set to `true` to return only featured posts.
- `search` (optional): Deep-search across `title`, `excerpt`, and `content`.
- `status` (optional, default: `published`): Retrieve by status (Note: Unauthenticated users are strictly locked to `published` regardless of query).

**Successful Response (200 OK):**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Brief excerpt...",
      "content": "Full markdown content",
      "status": "published",
      "category": { "id": 1, "slug": "category-slug", "name": "Category Name" },
      "tags": [ { "tag": { "id": 1, "slug": "tag-slug", "name": "Tag Name" } } ],
      "author": { "id": "123", "name": "Author", "image": "..." }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 45,
    "totalPages": 5
  }
}
```

#### `POST /api/posts` -> Create Post 
Creates a new post. (Requires Authentication).

**Body Parameters (JSON):**
- `title` (required): String
- `slug` (required): String (Must be unique)
- `content` (required): String
- `excerpt` (optional): String 
- `coverImage` (optional): String (Image URL)
- `categoryId` (optional): Number
- `status` (optional): String (e.g. `draft`, `published`)
- `featured` (optional): Boolean
- `readTime` (optional): Number
- `tagIds` (optional): Array of Numbers [1, 2, 3]

**Responses:**
- `201 Created`: The newly instantiated post object.
- `400 Bad Request`: `{"error": "Titre, slug et contenu requis"}`
- `401 Unauthorized`: `{"error": "Non authentifié"}`
- `409 Conflict`: `{"error": "Ce slug existe déjà"}`

---

#### `GET /api/posts/[slug]` -> Read Single Post
Retrieve full details of a specific post. Automatically increments view count.

**Responses:**
- `200 OK`: Single Post object.
- `404 Not Found`: `{"error": "Article non trouvé"}` (Occurs if not present or if user is unauthenticated and post isn't published).

#### `PUT /api/posts/[slug]` -> Update Post
Update properties of an existing post. (Requires Auth. Author or Superadmin rules apply).

**Body Parameters (JSON):**
Accepts the same partial payload as the `POST` create route.

**Responses:**
- `200 OK`: The updated Post object.
- `401 Unauthorized`: `{"error": "Non authentifié"}`
- `403 Forbidden`: `{"error": "Accès interdit"}`
- `404 Not Found`: `{"error": "Article non trouvé"}`

#### `DELETE /api/posts/[slug]` -> Remove Post
Delete a post record entirely. (Requires Auth. Author or Superadmin rules apply).

**Responses:**
- `200 OK`: `{"message": "Article supprimé"}`
- `401 Unauthorized`: `{"error": "Non authentifié"}`
- `403 Forbidden`: `{"error": "Accès interdit"}`
- `404 Not Found`: `{"error": "Article non trouvé"}`

---

### 2. Categories & Tags Management

#### `GET /api/categories` -> Public Categories Listing
Lists all categories alphabetically alongside total associated published posts.

**Successful Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Catégorie",
    "slug": "categorie",
    "_count": { "posts": 12 }
  }
]
```

#### `GET /api/tags` -> Public Tags Listing
Lists all tags alphabetically alongside associated post counts.

**Successful Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Actualités",
    "slug": "actualites",
    "_count": { "posts": 4 }
  }
]
```
