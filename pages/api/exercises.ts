import type { NextApiRequest, NextApiResponse } from 'next';

// Placeholder API route. Real database integration can be added later.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(501).json({ message: 'Not implemented' });
}
