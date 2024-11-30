import React from 'react';

const Review = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
      <div className="max-w-screen-xl mx-auto px-8">
        <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Customer Testimonials</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <figure className="flex flex-col items-center justify-center text-center bg-white p-8 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg">
              <blockquote className="text-gray-500 dark:text-gray-400">
                <p className="mb-4">"Very easy this was to integrate. If you care for your time, I hands down would go with this."</p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Bonnie Green</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Developer at Open AI</p>
              </blockquote>
            </figure>

            <figure className="flex flex-col items-center justify-center text-center bg-white p-8 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg">
              <blockquote className="text-gray-500 dark:text-gray-400">
                <p className="mb-4">"Designing with Figma components that can be easily translated to the utility classes of Tailwind CSS is a huge timesaver!"</p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Roberta Casas</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lead designer at Dropbox</p>
              </blockquote>
            </figure>
          </div>

          {/* Additional testimonials can be added in a similar structure */}
        </div>
      </div>
    </div>
  );
};

export default Review;
