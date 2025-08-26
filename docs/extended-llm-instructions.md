# GitHub Copilot Project Guidelines


## 1. Language Rules
- All **code generation and documentation** must be in **English**.
- **UI content, placeholder text, example data, or mock content** may be in other languages only if explicitly requested.

---

## 2. Coding Style Compliance
- There must always be a **Markdown file** in the `docs/` directory that defines the **project’s coding style guide**.
- You **must follow** that guide for formatting, naming, and structure.
- If it's missing or unclear, **ask for clarification before generating any code**.

---

## 3. Documentation Requirements
- All documentation must reside in `docs/` as Markdown files.
- Functionalities, endpoints, and workflows must be fully documented.
- If code generation **modifies or adds**:
  - DTOs
  - Types / Interfaces
  - Functionality
  
  → **Update the corresponding documentation Markdown files** in `docs/`.

- **README.md** must include:
  - Project description
  - Overview of functionality
  - Usage instructions
  - Installation steps  
  → Refer to more detailed information via links to Markdown files in `docs/`.

---

## 4. Code Quality Standards
- Enforce:
  - **SOLID Principles**
  - **DRY Principle**
  - **Vertical Slice Clean Architecture** with **Ports & Adapters**
- Prioritize readability, maintainability, and scalability.
- Use meaningful names for functions, variables, and classes.

---

## 5. Diagramming Standard
- **Every diagram** included in **any Markdown file**, especially those in `docs/`, **must** be authored in **embedded PlantUML or Mermaid syntax**.
  - Use fenced code blocks with `plantuml` or `mermaid` language tags.
  - Do not use image files, external visual editors, or proprietary formats.
  - This ensures diagrams remain version-controlled, editable, and part of the codebase.  
  :contentReference[oaicite:0]{index=0}

---

## 6. Testing Requirements
- For every new or modified function/method, create or update corresponding **unit tests**.
- Unit tests must:
  - Be self-contained (avoid external state unless required)
  - Follow Arrange-Act-Assert or the project’s standard pattern
  - Cover both happy paths and edge cases

---

## 7. Architectural Guidelines
- Use **Vertical Slice Clean Architecture** with Ports & Adapters.
- Layers:
  - **Domain Layer**: Entities and business logic
  - **Application Layer**: Orchestration and use-case interfaces
  - **Infrastructure Layer**: Frameworks, databases, APIs, and adapters
- Apply **Dependency Inversion** to decouple layers.

---

## 8. Interaction with Copilot
When generating or modifying code:
1. Refer to and apply the style guide in `docs/`; ask if it's missing.
2. Update related documentation in `docs/`, including diagrams using PlantUML or Mermaid.
3. Generate or update unit tests for affected logic.
4. Respect Clean Architecture and vertical slice boundaries.
5. Deliver commit-ready code—no placeholder stubs unless explicitly requested.

---

## 9. Commit & Review Standards
- Commits must be clear and concise, describing what and why.
- Group related changes logically.
- Reference relevant tickets/issues.
- Require peer review before merging into main branches.