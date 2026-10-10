import { Helmet } from "react-helmet-async";
import AuthorsBar from "../AuthorsBar/AuthorsBar";

const Authors_Hub = () => {
  return (
    <div className="text-center gap-6 mb-10">
      <Helmet>
        <title>Author's Hub</title>
        <meta name="description" content="Learn more about us on this page" />
      </Helmet>
      {/* <p className="font-bold text-2xl">Authors page</p> */}
      <AuthorsBar></AuthorsBar>
      <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-subtle bg-surface p-8">
        <h1 className="mb-4 text-3xl font-bold text-content">
          Project Overview: <span className="text-accent-400">Gadget Heaven</span>
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-muted">
          Welcome to <span className="font-semibold text-content">Gadget Heaven</span>, an
          intuitive, dynamic e-commerce platform designed to provide users with
          an engaging and user-friendly shopping experience. Built with a modern
          tech stack and adhering to industry best practices, this site offers a
          streamlined browsing and purchasing experience, featuring an organized
          product catalog, a comprehensive wishlist and cart system, and an
          efficient checkout process.
        </p>

        <h2 className="mb-3 text-2xl font-semibold text-content">
          Learning Points of Project Creation
        </h2>

        <ol className="space-y-4">
          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              1. Dynamic State Management
            </h3>
            <p>
              Implemented efficient state management to ensure smooth
              transitions for actions like adding/removing items from the cart
              and wishlist.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              2. Custom Hooks and Context API
            </h3>
            <p>
              Used React’s Context API for global state management, avoiding
              prop drilling and improving maintainability. Custom hooks
              encapsulated reusable logic, enhancing readability.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              3. Toaster Notifications
            </h3>
            <p>
              Integrated real-time toaster notifications with{" "}
              <code>react-toastify</code> for immediate feedback on actions like
              adding/removing items, enhancing user engagement.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              4. Responsive and Engaging UI/UX Design
            </h3>
            <p>
              Crafted a responsive layout that provides a seamless experience
              across all devices, making the site accessible and visually
              appealing on desktop and mobile alike.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              5. Routing and Dynamic Titles
            </h3>
            <p>
              Used <code>react-router-dom</code> for seamless multi-page
              navigation, dynamically setting page titles to improve user
              orientation and SEO.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              6. Sorting and Filtering Logic
            </h3>
            <p>
              Added sorting functionality to organize products by attributes,
              demonstrating data manipulation and user preference management.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              7. Enhanced Error Handling and User Feedback
            </h3>
            <p>
              Implemented error handling and informative messages to engage
              users and guide them through corrective actions if needed.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              8. Project Organization and Component Architecture
            </h3>
            <p>
              Adopted a modular approach, making the codebase easy to maintain
              and scalable for future enhancements.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              9. Using Third-Party Libraries for Efficiency
            </h3>
            <p>
              Used libraries like <code>react-toastify</code> for notifications
              and <code>react-helmet</code> for dynamic titles, adding polish
              while focusing on core features.
            </p>
          </li>

          <li className="bg-surface-2/60 p-4 rounded-xl">
            <h3 className="font-semibold text-lg text-content">
              10. Building a Scalable and Maintainable Codebase
            </h3>
            <p>
              Applied clean code practices and modern JavaScript best practices
              to create a scalable codebase, facilitating future improvements
              and collaborative development.
            </p>
          </li>
        </ol>

        <div className="mt-8 rounded-xl bg-accent-500/10 p-4">
          <p className="text-lg font-semibold text-accent-400">Conclusion</p>
          <p className="mt-2 text-muted">
            This project highlights essential skills in state management, UI/UX
            design, and dynamic functionality for an e-commerce platform. It
            serves as a foundation for building scalable, user-centered web
            applications, offering valuable experience for future projects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authors_Hub;
