export const createFragment = (
  start: number = 0,
  end: number = 0,
  weight = 150,
  penalty = 0
) => {
  return {
    end,
    hint: {
      name: 'Многократное восклицание',
      description: 'Лучше не использовать более одного восклицательного знака. \
        Чем больше восклицаний — тем слабее эффект. ',
      penalty,
      weight
    },
    start,
    url: "https://glvrd.ru/?text=!!!"
  }
}

export const createProof = (...frgms) => {
  return {
    fragments: frgms.map(fragment => createFragment(fragment[0], fragment[1])),
    score: '1.2',
    status: 'ok'
  };
}