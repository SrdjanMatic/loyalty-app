import { Listbox } from "@headlessui/react";
import { HiSelector } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import "./RestaurantSelect.css";

interface RestaurantSelectProps {
  selected: any;
  onChange: (value: any) => void;
  items: any[];
}

export const RestaurantSelect: React.FC<RestaurantSelectProps> = ({
  selected,
  onChange,
  items,
}) => {
  const { t } = useTranslation();

  return (
    <div className="restaurant-select">
      <Listbox value={selected} onChange={onChange}>
        <div className="listbox-wrapper">
          <Listbox.Button className="listbox-button">
            <span className="listbox-button-text">
              {t("Select restaurant")}
            </span>
            <span className="listbox-button-icon">
              <HiSelector size={20} />
            </span>
          </Listbox.Button>

          <Listbox.Options className="listbox-options">
            {items
              .filter((item) => item.active !== true)
              .map((restaurant) => (
                <Listbox.Option
                  key={restaurant.id}
                  value={restaurant}
                  className={({ active }) =>
                    `listbox-option ${active ? "active" : ""}`
                  }
                >
                  <div className="option-name">{restaurant.name}</div>
                  <div className="option-address">{restaurant.address}</div>
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default RestaurantSelect;
