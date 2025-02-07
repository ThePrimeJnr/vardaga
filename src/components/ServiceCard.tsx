import React from "react";

interface ServiceCardProps {
  home_name: string;
  about: string;
  contact_email: string;
  url: string;
  images: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  home_name,
  about,
  contact_email,
  url,
  images,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {images && images.length > 0 && (
        <img
          src={images[0]}
          alt={home_name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{home_name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{about}</p>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <a
            href={`mailto:${contact_email}`}
            className="hover:text-accent-700 text-sm flex items-center gap-2"
          >
            <svg
              width="23"
              height="16"
              viewBox="0 0 23 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.12769 0H20.4367C21.0219 0 21.555 0.234523 21.9398 0.613638C22.3257 0.99275 22.5644 1.51531 22.5644 2.09022V13.9098C22.5644 14.4847 22.3257 15.0084 21.9398 15.3864C21.5538 15.7655 21.0231 16 20.4367 16L2.12769 15.9989C1.54245 15.9989 1.01055 15.7643 0.62464 15.3852C0.238731 15.0061 0 14.4847 0 13.9086L0.00115887 2.09024C0.00115887 1.51531 0.239887 0.992778 0.625798 0.613666C1.01055 0.234554 1.54245 0 2.12769 0ZM21.0544 14.6953L13.9622 8.71946L12.9412 9.57899C12.4834 9.96492 11.8855 10.1596 11.2921 10.163C10.6976 10.1653 10.1008 9.97517 9.64538 9.59153L8.60934 8.71946L1.51477 14.6976C1.68512 14.8262 1.89836 14.9037 2.12781 14.9037H20.4368C20.6686 14.9037 20.8829 14.825 21.0544 14.6953ZM1.11723 13.5921L7.75523 7.99983L1.11723 2.4067V13.5921ZM1.51471 1.30125L8.96618 7.57985L8.97545 7.58782L10.3684 8.76156C10.6164 8.9699 10.9501 9.07349 11.2874 9.07122C11.6269 9.07008 11.9642 8.96193 12.2168 8.74789L13.5935 7.58779L13.6051 7.57755L21.053 1.30244C20.8815 1.17265 20.6671 1.0941 20.4365 1.0941L2.12752 1.09638C1.89806 1.09638 1.68506 1.1726 1.51471 1.30125ZM21.4483 2.41238L14.8171 7.99997L21.4492 13.5876V2.41238H21.4483Z"
                fill="black"
              />
            </svg>
            Visa kontaktinformation
          </a>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <button className="bg-accent-900 hover:bg-accent-700 text-white rounded-full text-sm py-2 px-8">
              Läs mer
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
