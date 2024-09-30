import React, { useState, useRef, useEffect } from "react";
import { getStudentAsync } from "redux/async.api";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";

const MultiselectSearch = ({
  selectedOptions,
  setSelectedOptions,
  setCheckedAll,
  userSelected,
  setUserSelected,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const { studentLoader, students } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(
      getStudentAsync({
        page: 1,
        limit: 20,
        course: "",
        classes: "",
        search: "",
        type: "",
      })
    );
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  const handleCheckboxChange = (optionId) => {
    const newSelectedOptions = new Set(selectedOptions);
    if (newSelectedOptions.has(optionId)) {
      newSelectedOptions.delete(optionId);
    } else {
      newSelectedOptions.add(optionId);
    }

    setSelectedOptions(newSelectedOptions);

    if (newSelectedOptions.size > 0) {
      setUserSelected(true);
    }

    if (newSelectedOptions.size === students?.data?.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const allIds = students?.data?.map((option) => option.id);
      setSelectedOptions(new Set(allIds));
      setCheckedAll(true);
      setUserSelected(true);
    } else {
      setSelectedOptions(new Set());
      setCheckedAll(false);
      setUserSelected(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      getStudentAsync({
        page: 1,
        limit: 20,
        course: "",
        classes: "",
        search: searchTerm,
        type: "",
      })
    );
  };

  return (
    <div ref={dropdownRef} className="dropdown">
      <button
        className="dropdown-button"
        onClick={toggleDropdown}
        style={{ borderColor: userSelected ? "" : "red" }}
      >
        {selectedOptions.size === students?.data?.length &&
        students?.data?.length > 0
          ? "Selected: All"
          : `Selected: ${selectedOptions.size}`}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <div
            style={{
              display: "flex",
              paddingRight: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              className="styled-button"
              type="submit"
              onClick={handleSubmit}
            >
              {studentLoader ? "Loading..." : "Search"}
            </button>
          </div>

          {/*<div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: "10px",
                paddingLeft: "10px",
                gap: "10px",
              }}
            >
              <input
                type="text"
                onChange={handlePage}
                className="text-input"
                placeHolder="Page"
              />
              <input
                type="text"
                onChange={handleLimit}
                className="text-input"
                placeHolder="Limit"
              />
            </div>

            <button className="styled-button-load">
              <img src={loadmore} alt="title" width="100%" />
            </button>
          </div> */}

          <div>
            {students?.data?.length > 0 && (
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={selectedOptions.size === students?.data?.length}
                  onChange={handleSelectAll}
                  className="custom-checkbox-input"
                />
                <span className="custom-checkbox"></span>
                Select All
              </label>
            )}

            {students?.data?.length > 0 ? (
              students?.data?.map((option) => (
                <label key={option.id} className="option-label">
                  <input
                    type="checkbox"
                    checked={selectedOptions.has(option.id)}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="custom-checkbox-input"
                  />
                  <span className="custom-checkbox"></span>
                  {option.name} ({option.phone})
                </label>
              ))
            ) : (
              <div
                style={{
                  fontSize: "14px",
                  marginLeft: "16px",
                  marginBottom: "10px",
                }}
              >
                No User Found!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiselectSearch;
