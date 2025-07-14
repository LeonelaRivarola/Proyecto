import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Asignar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      asignarrr ${id}
    </div>
  )
}

export default Asignar
