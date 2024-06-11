"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const TicketForm = ({ ticket }) => {
  const router = useRouter();
  const EDITMODE = ticket && ticket._id !== "new";

  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "Hardware Problem",
  };

  if (EDITMODE) {
    startingTicketData["title"] = ticket.title;
    startingTicketData["description"] = ticket.description;
    startingTicketData["priority"] = ticket.priority;
    startingTicketData["progress"] = ticket.progress;
    startingTicketData["status"] = ticket.status;
    startingTicketData["category"] = ticket.category;
  }

  // This is a state managed form - so state is changing constantly.
  const [formData, setFormData] = useState(startingTicketData);

  const handleChange = (e) => {
    // value what we want to change will get from e.target.value --
    const value = e.target.value;
    const name = e.target.name;

    // usestate func
    // using prev data and changing what we need to change i.e "VALUE"
    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (EDITMODE) {
      const res = await fetch(`/api/Tickets/${ticket._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      if (!res.ok) {
        throw new Error("Failed to update ticket");
      }
    } else {
      const res = await fetch("/api/Tickets", {
        method: "POST",
        body: JSON.stringify({ formData }),
        //@ts-ignore
        "Content-Type": "application/json",
      });
      if (!res.ok) {
        throw new Error("Failed to create ticket");
      }
    }
    router.refresh();
    router.push("/");
  };

  const categories = [
    "Hardware Problem",
    "Software Problem",
    "Application Development",
    "Project",
  ];

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-1/2"
        method="post"
      >
        <h3>{EDITMODE ? "Update Your Ticket" : "Create your ticket"}</h3>
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />

        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows={5}
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category, _index) => (
            <option key={_index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Priority</label>
        <div>
          {[1, 2, 3, 4, 5].map((priority) => (
            <div key={priority}>
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority == priority}
              />
              <label>{priority}</label>
            </div>
          ))}
        </div>

        <label>Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
        />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not started">Not Started</option>
          <option value="started">Started</option>
          <option value="done">Done</option>
        </select>
        <input
          type="submit"
          className="btn"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default TicketForm;
